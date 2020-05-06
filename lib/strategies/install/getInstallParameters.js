module.exports = function getInstallParameters(parameters, parametersKeys, script) {
  if (!parametersKeys && !parameters) {
    return script;
  }
  parametersKeys.forEach((key) => {
    const parameterKey = key.id;
    const parameter = parameters[parameterKey];
    script += ` ${parameter}`;
  });
  return script;
};
