# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.9.1] - 2022-07-25
### Changed
- bumped `modbus2mqtt` to version `v2.0.0` 

## [1.9.0] - 2022-04-03
### Added
- Custom behaviour `ACTION_REQUEST_AND_UPLOAD` on control topic

## [1.8.5] - 2022-01-13
### Changed
- bumped `modbus2mqtt` to version `v1.1.6` 

## [1.8.4] - 2022-09-15
### Removed
- `package-lock.json`
  
## [1.8.3] - 2022-09-15
### Changed
- updated modbus2mqtt docker image in modbus installation script
## [1.8.2] - 2022-05-10
### Changed
- modbus2mqtt container version in installation script
- removed set-env statements in workflow files

## [1.8.1] - 2020-05-21
### Added
- add http2mqtt install script

## [1.8.0] - 2020-05-21
### Added
- on premise functionality 
- integration with MongoDb

## [1.7.3] - 2020-05-13
### Fixed
- add `clientId` getter to `BaseStrategy` class

## [1.7.2] - 2020-05-12
### Removed
- `gate-addon-knx` from dependencies

## [1.7.1] - 2020-05-06
### Changed
- bumped to Zigbee2MQTT v1.13.0

## [1.7.0] - 2020-05-06
### Added
- send all containers logs 
### Changed
- wait 1s between `discovering` and `paired` status on pairing a device

## [1.6.2] - 2020-05-04
### Changed
- on timeout discovering remove instance from AddOnHandler

## [1.6.1] - 2020-04-30
### Changed
- fix logging to cloud

## [1.6.0] - 2020-04-28
### Addedd
- install script for knx protocol
- handling `@instathings/gate-addon-knx` dependency
### Changed
- splitted stdout and stderr log stream

## [1.5.0] - 2020-04-22
### Changed
- splitted stdout and stderr log stream
- when reporting log adding type

## [1.4.4] - 2020-04-20
### Changed
- bumped `modbus2mqtt` to v1.1.1
- bumped `node-red` to v1.0.5

## [1.4.3] - 2020-04-20
### Changed
- handling `modbus` protocol update
- handling `automations` protocol update

## [1.4.2] - 2020-04-16
### Changed
- bumped to Node.js v12.16.2
- handling `@instathings/gate-addon-modbus` dependency

## [1.4.1] - 2020-04-15
### Changed
- `automations` installs @instathings/node-red-contrib-device-in
- `automations` installs @instathings/node-red-contrib-device-out
- `zigbee` installs `zigbee2mqtt:1.12.2` 

## [1.4.0] - 2020-04-14
### Added
- handling gate logs

## [1.3.6] - 2020-04-08
### Changed
- fixed notify version

## [1.3.5] - 2020-04-08
### Changed
- fix on `automations` install script

## [1.3.4] - 2020-04-08
### Changed
- fixed notify version

## [1.3.3] - 2020-04-08
### Changed
- fix on `automations` install script

## [1.3.2] - 2020-04-08
### Added
- Handling protocol update message 
### Changed
- `mosquitto` container name in `eclipse-mosquitto`
- `zigbee2mqtt` container name in `koenkk-zigbee2mqtt`
- fixed `automations` install script

## [1.3.1] - 2020-04-06
### Added
- Handling software update message 

## [1.3.0] - 2020-03-30
### Changed
- Code refactor 
- Bumped `eclipse-mosquitto` to` v1.6.9`
- Bumped `zigbee2mqtt` to `v1.12.0`
### Added
- Reading `REGION` from env variable if available, compatibility kept with `eu-west-1` default region
- Some tests

## [1.2.7] - 2020-03-23
### Changed
- Fix build process

## [1.2.6] - 2020-03-23
### Changed
- Build process

## [1.2.5] - 2020-03-19
### Fix
- fix on readme

## [1.2.4] - 2020-03-19
### Added
- README.md

## [1.2.3] - 2020-03-18
### Changed
- Bumped Node.js version 12.16.1
- Fixed Zigbee protocol script

## [1.2.2] - 2020-03-17
### Changed
- Bumped dependencies

## [1.2.1] - 2020-03-04
### Added
- PairingIndicatorsSubdevice component
- Unlink feature

## [1.2.0] - 2020-03-02
### Added
- first test for `AddOnHandler`
- support for `control/get` mqtt messages

## [1.1.2] - 2020-02-26
### Added
- `master` branch added to build.yml 

## [1.1.1] - 2020-02-26
### Changed
- No changes, waiting for build

## [1.1.0] - 2020-02-25
### Added
- add feature to control devices

## [1.0.1] - 2020-02-17
### Added
- fix subscription to discover topic

## [1.0.0] - 2020-02-17
### Added
- set up gate environment with docker
