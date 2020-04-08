# Changelog
All notable changes to this project will be documented in this file.


The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
