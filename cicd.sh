#!/bin/bash

# print to screen with colour
print_message() {
  local short_message=$1
  local long_message=$2
  local colour=$3
  local verboseArg=$4
  local return=$5
  local return_str="\n"

  local colour_code=""
  local end_code="\e[0m"

  case $colour in
    "red")
      colour_code="\e[31m"
      ;;
    "blue")
      colour_code="\e[34m"
      ;;
    *)
      colour_code=""
      end_code=""
      ;;
  esac

  if [ "$verboseArg" = "verbose" ]; then
      printf "%b\n" "$long_message"
  fi

  if [ "$return" = "in-line" ]; then
    return_str=""
  fi

  printf "${colour_code}%b%b${end_code}" "$short_message" "$return_str"

}

# Run a command and print the result
run_command() {
  local description=$1
  local command=$2
  local directory=$3

  print_message "$description" "" "blue" "" "in-line"

  if [ -n "$directory" ]; then
    cd "$directory" || return
  fi

  output=$(eval "$command" 2>&1)
  exit_code=$?

  if [ $exit_code -ne 0 ]; then
    print_message " - failed\n" "" "red"
    print_message "$description - failed!" "Error: $output" "red" "verbose"
    exit $exit_code
  fi

  if [ -n "$directory" ]; then
    cd ..
  fi

  print_message " - pass" "" "blue"
}

print_message "Running CICD tasks" "" "blue"

exit 1

run_command "Formatting of TypeScript" "npx prettier --config .prettierrc --check './utils/**/*.ts' --color"

run_command "Linting of TypeScript" "npx eslint '**/*.ts' --color"

run_command "Formatting of Quarto files" "npx prettier --check '**/*.qmd' --color"

run_command "Creating Quarto static pages" "quarto render"

run_command "Post-render unit tests" "npm exec npx jest tests/post-render/*.ts" "utils"

print_message "All tasks completed successfully" "" "blue"