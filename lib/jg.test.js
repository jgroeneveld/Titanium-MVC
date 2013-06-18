jg.test = {};

(function() {
    var registeredTests = [];
    var activeTest = null;
    var activeTestFailed = false;
    var numberOfFailedTests = 0;
    var numberOfRunTests = 0;

    jg.test.register = function(description, test) {
        registeredTests.push({description: description, test: test});
    };

    jg.test.run = function() {
        jg.info('__________ Starting Tests __________');

        registeredTests.each(function(test) {
            activeTestFailed = false;
            activeTest = test;

            jg.info('=> starting ', test.description);
            test.test();

            activeTest = null;
            if (activeTestFailed) {
                numberOfFailedTests++;
            }
            numberOfRunTests++;
        });

        jg.info('__________ Tests Finished __________');
        jg.info('Ran ' + numberOfRunTests + ' and failed ' + numberOfFailedTests + ' tests');
    };

    jg.test.assert = function(expression, description) {


        if (!expression) {
            var error = '[' + activeTest.description + '] failed';
            if (description) {
                error += ': ' + description;
            }

            jg.error(error);
            activeTestFailed = true;
        }
    };

    jg.test.assertEqual = function(one, two, description) {
        var error = one + ' is not ' + two;

        if (description) {
             error += ' (' + description + ')'
        }

        jg.test.assert(one === two, error);
    };
}());
