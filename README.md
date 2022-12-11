![](https://github.com/Pawel-Albert/utilities-for-testing-extension/blob/main/%F0%9F%92%BButylis%E2%9A%99%EF%B8%8F.png)

# Google chrome extension with couple of small functionalities for testers in form of context menu

## Project Description

> Project is a chrome extension in form of context menu (avaliable via rmb)- mostly niche and current company specific functionalities

> Project was written in vanilla Javascript, bundled with Parcel and for fake data generation to some extent fakerjs was used.

> This project heavly uses already writen code in my other project https://github.com/Pawel-Albert/test-data-generators

> Purpose of the project is to provide some actual utility tool for personal and team usage and in the same time to practice building own chrome extension and just have fun while coding small scripts.

> Disclaimer: This project is by no means a fully fledged commercial lvl extension. But as responsible testers (I try to be one) we should avoid to maximum using online external tools to manipulate our test/production data. Furthemore when it coms form fillers, creating one on your own will always be better than anything available on the market as most solution either dont work or work in way that customizing it is really bad experience.

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
After using right mouse button you can hover on TesterUtilities and click on desired functionality. Current functionality list provided below, with short information what they are doing(if needed) and how to use them in more details:

- "Remove all 'disabled' attributes"
  > It will remove all 'disabled' atributes and also css classes with 'disabled' name.
  > This script can be also run by using shortcut command - default is 'ALT + 1'.
  > Shortcuts can be changed at any time - go to chrome://extensions/shortcuts.
- "Highlight elements with same ID"
- "Clear_all_input_restrictions"
  > It will remove few typical input restrictions: required, maxlength, minlength, onpaste function.
- "Change all inputs type from password to text"
- "JSON prettier via console"
  > After clicking it in context menu you will be asked in window prompt to input a valid JSON that will be printed in dev tools console in a formatted way.
- "Timestamp to date"
  > After clicking it in context menu you will be asked in window prompt to input locale timezone(default is 'pl') and after that a valid timestamp (example: 1669852799000). Result will be displayed in window Alert in provided locale timezone.
- "Base64 decode and print to console"
- "Base64 encode and print to console"
- "Generate PESEL (18+)"
  > Designed usage is on inputs - generates valid Polish "PESEL" (thats an Universal Electronic System for Registration of the Population).
  > Above and all other (generate scripts), besides populating input with the data, the data is also printed to the dev tools console.
- "Generate IBAN"
- "Generate ID number"
- "Generate PASSPORT number"
- "Generate ID number"
- "Generate PASSPORT number" Simple form filler
- "Simple form filler"
  > It will populate all fields(if they exists) in a register form - locale for this data (custom and fakerjs) is "pl".
  > CSS selectors used where designed to work with company specific sites (around 9 sites with with only moderate variation).
  > To use it you can choose it from context menu UI, or user provided default shortcut that is 'ALT + 2'.
- "Simple form filler EN"
  > It will populate all fields(if they exists) in a register form - locale for this data (custom and fakerjs) is "en-NG".
  > Fields and css selectors are similar to 'base' version but not to extent to safely use same patterns.
  > It's not avaliable in context menu UI, to use it user can press default shortcut that was set to 'ALT + 3'.

## Todo

- [x] Form auto filler with random data
- [x] Fix Generate functions, as currently they are not registered by browser as user actions
- [ ] Lot of small "quality of life changes" on user requests
