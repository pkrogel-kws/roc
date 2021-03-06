import { escape } from 'lodash';

import buildDocumentationObject, { sortOnProperty } from '../buildDocumentationObject';
import generateTable from '../generateTable';
import pad from '../helpers/pad';
import getDefaultValue from '../helpers/getDefaultValue';

export default function settingsToMarkdown(name, { settings } = {}, { settings: meta } = {}, filter = []) {
    const documentationObject = sortOnProperty('name', buildDocumentationObject(settings, meta, filter, true));

    const header = {
        name: {
            name: 'Name',
        },
        description: {
            name: 'Description',
            renderer: (input) => escape(input),
        },
        path: {
            name: 'Path',
        },
        cli: {
            name: 'CLI option',
        },
        defaultValue: {
            name: 'Default',
            renderer: (input) => input !== undefined && `\`${getDefaultValue(input)}\``,
        },
        type: {
            name: 'Type',
            renderer: (input) => input && `\`${input}\``,
        },
        required: {
            name: 'Required',
            renderer: (input) => {
                if (input === true) {
                    return 'Yes';
                }
                return 'No';
            },
        },
        canBeEmpty: {
            name: 'Can be empty',
            renderer: (input) => {
                if (input === true) {
                    return 'Yes';
                } else if (input === false) {
                    return 'No';
                }

                return '';
            },
        },
        extensions: {
            name: 'Extensions',
            renderer: (input) => input.join(', '),
        },
    };

    const settingsTable = generateTable(documentationObject, header, {
        groupTitleWrapper: (title, level) => `${pad(level + 2, '#')} ${title.charAt(0).toUpperCase() + title.slice(1)}`,
    });

    const rows = [];

    rows.push(`# Settings for \`${name}\``, '');

    if (settingsTable.length === 0) {
        rows.push('__No settings available.__', '');
    } else {
        rows.push(settingsTable);
    }

    return rows.join('\n');
}
