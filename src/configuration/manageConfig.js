import { bold, yellow } from 'chalk';

import log from '../log/default/large';
import merge from '../helpers/merge';

import { appendSettings } from './manageSettings';

/* Make sure that we only print some feedback once */
let onceSettings = true;

/* Using global variables here to make sure that we can access the values set from different projects.
 * This guarantees that the variables will live outside the require cache, something that we need for stability.
 */
global.roc = global.roc || {};
global.roc.context = global.roc.context || {};
global.roc.context.config = global.roc.context.config || undefined;

/**
 * Gets the current configuration object.
 *
 * Will try to init the configuration if not done previously.
 *
 * @param {boolean} [fail=true] - If the function should fail if no configuration exists
 *
 * @returns {rocConfig} - The application configuration object.
 */
export function getConfig(fail = true, state = global.roc.context.config) {
    // Try to load the configuration if we haven't at this point.
    if (fail && state === undefined && !process.env.ROC_CONFIG_SETTINGS) {
        log.error(
            'It seems that you are launching a Roc project without using the Roc CLI.\n' +
            'Please use the CLI or add the Roc runtime to your project.\n\n' +
            `${bold('Example:')}\n` +
            `${yellow('import \'roc/runtime/register\';')} or ${yellow('require(\'roc/runtime/register\');')}\n\n` +
            'See the documentation for more information.',
            'Configuration'
        );
    }

    if (onceSettings && process.env.ROC_CONFIG_SETTINGS) {
        onceSettings = false;

        const environmentSettings = JSON.parse(process.env.ROC_CONFIG_SETTINGS);

        if (state && state.settings && Object.keys(state.settings).length > 0 &&
            process.env.ROC_CONFIG_SETTINGS
        ) {
            log.info(
                `You have settings defined on the environment variable ${bold('ROC_CONFIG_SETTINGS')} ` +
                'and they will be appended to the settings. Will append the following:\n' +
                JSON.stringify(environmentSettings, null, 2),
                'Configuration'
            );
        }

        // eslint-disable-next-line
        state.settings = appendSettings(environmentSettings, state);
    }

    return state;
}

/**
 * Appends to the configuration object.
 *
 * Will merge with the already existing configuration object meaning that this function can be called multiple times and
 * the configuration will be a merge of all those calls.
 *
 * @param {!rocConfig} config - A configuration object.
 *
 * @returns {rocConfig} - The configuration object.
 */
export function appendConfig(config) {
    global.roc.context.config = merge(getConfig(false), config);
    return getConfig();
}

export function setConfig(newConfig, state) {
    if (state === undefined) {
        global.roc.context.config = newConfig;
    }

    return newConfig;
}
