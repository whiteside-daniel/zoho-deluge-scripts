# Zoho Deluge Scripts
This package contains Zoho Deluge scripts for CRM, Desk, Creator, etc.

## About Deluge Code
Deluge is a scripting language specifically for use with Zoho products like CRM, Desk, and Creator. Deluge's syntax is similar to JavaScript so the files here are named with .js filetype for GitHub to recognize common formatting and styling. This code is not ordinary JavaScript and will not run in a standalone JS engine/environment.

## About this Repository
Each .js file contains a unique Deluge script for a specific task (i.e. one file is the script for copying attachments from one module to another) and each task will only require one file. Each file is named according to its function. 

## Syntax of this Repository
Variables that you need to fill in before running the script have angle brackets like this <Variable_Name>. Ultimately a variable like <Record_Id> will actually be replaced with a real "record Id". As a further example a function that reads zoho.crm.updateRecordById(<Module_Name>, <Record_Id>, <Parameter_Map>), each variable (in this case three variables) need to be replaced with actual values before running the script.
