# avd-launcher

Launch an Android Virtual Device without Android Studio.

## But why?

We can already launch AVDs without Android Studio by using the `emulator` command.

```
$ emulator -avd avd_name
```

This CLI tool does nothing more than wrap the above command and provides an easier way to interface.

![demo](demo.gif)

## Install

Install via npm:

```
$ npm install --global avd-launcher
```

Then run `avd` from your terminal.

## Notes

Currently, this tool assumes that you have an `ANDROID_HOME` environment variable set in your shell that points to a valid Android sdk directory.
