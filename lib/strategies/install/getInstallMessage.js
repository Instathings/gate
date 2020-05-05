module.exports = function getInstallMessage(protocol, protocolId, autoResults) {
  const { install, versions, listAfter } = autoResults;
  const newContainers = listAfter.newContainersNames;
  const code = install[0];
  const stdout = install[1];
  const stderr = install[2];
  return {
    dt_install: new Date().getTime(),
    protocol,
    protocolId,
    exitStatus: code,
    installationSuccess: code === 0,
    stdout,
    stderr,
    versions,
    newContainers,
  };
};
