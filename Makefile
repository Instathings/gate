test-all:
	./node_modules/mocha/bin/mocha test/AddOnHandler.js
	./node_modules/mocha/bin/mocha test/methods/getConnectionOptions.js
	./node_modules/mocha/bin/mocha test/strategies/BaseStrategy.js
	./node_modules/mocha/bin/mocha test/strategies/NoOpStrategy.js
