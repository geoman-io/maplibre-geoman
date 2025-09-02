#!/bin/sh

# --line-number\

code2prompt\
 --tokens format\
 --no-clipboard\
 --exclude="*.png,*.lock,**/package-lock.json"\
 --template=./llm_template.hbs\
 --output-file=./llm-prompt.txt\
 ../
