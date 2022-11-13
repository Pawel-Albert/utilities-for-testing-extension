![](https://github.com/Pawel-Albert/utilities-for-testing-extension/blob/main/%F0%9F%92%BButylis%E2%9A%99%EF%B8%8F.png)

# Google chrome extension with couple of small functionalities for testers in form of context menu



## Project Description
  
> Project is a chrome extension in form of context menu (avaliable via rmb)- mostly niche and current company specific functionalities

> Project was written in vanilla Javascript and bundled with Parcel

> This project heavly uses already writen code in my other project https://github.com/Pawel-Albert/test-data-generators

> Purpose of the project is to provide some actual utility tool for personal and team usage and in the same time to practice building own chrome extension.
## Installation
### Clone

- Clone this repo to your local machine using 
```shell
git clone https://github.com/Pawel-Albert/utilities-for-testing-extension.git
```
### Setup

- Type in terminal
```shell
$ npm instal
$ npm build
```
> After that a folder "dist" should be created
>
> Go to chrome://extensions/
>
> While in developer mode use "load unpacked" extension option and choose "dist" folder
>
> Extension now is ready to use (remember to allow for use in incognito mode if needed)

## Features
All features are avaliable to use in form of context menu.
After using right mouse button you can hover on TesterUtilities and click on desired functionality. Curent functionality list provided below:

* "Remove all 'disabled' attributes"
* "Highlight elements with same ID"
* "Highlight  and show all 'display none' elements"
* "Highlight  and show one 'display none' element"
* "Clear_all_input_restrictions"
* "JSON prettier via console"
* "Timestamp to date via console"
* "Base64 decode and print to console"
* "Base64 encode and print to console"
* "Generate PESEL (18+)"
* "Generate IBAN"
* "Generate ID number"
* "Generate PASSPORT number"

## Todo

- [ ] Form auto filler with random data
- [ ] Fix Generate functions, as currently they are not registered by browser as user actions

