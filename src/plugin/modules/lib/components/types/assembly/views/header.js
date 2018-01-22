define([
    'knockout-plus',
    'kb_common/html',
    '../../common',
    'bootstrap',
    'css!font_awesome'
], function (
    ko,
    html,
    common
) {
    'use strict';

    var t = html.tag,
        span = t('span'),
        div = t('div');

    function viewModel(params) {
        return {};
    }



    function buildSortLabel(fieldName, fieldLabel) {
        return fieldLabel;
    }

    function template() {
        return div({}, [
            div({
                class: ' -field -title',
                style: {
                    width: '50%'
                }
            }, 'Name'),

            div({
                class: '-field -dna-size',
                style: {
                    width: '10%'
                }
            }, 'DNA Size'),
            div({
                class: '-field -contig-count',
                style: {
                    width: '10%'
                }
            }, buildSortLabel('contig_size', 'Contigs')),
            div({
                class: '-field -created',
                style: {
                    width: '15%'
                }
            }, 'Created'),
            div({
                class: '-field -owner',
                style: {
                    width: '15%'
                }
            }, 'Owner')
        ]);
    }

    function component() {
        return {
            viewModel: viewModel,
            template: template()
        };
    }

    return component;
});