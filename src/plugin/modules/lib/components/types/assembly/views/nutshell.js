define([
    'bluebird',
    'knockout-plus',
    'kb_common/html',
    'kb_common/jsonRpc/dynamicServiceClient',
    '../../common',
    'bootstrap',
    'css!font_awesome'
], function (
    Promise,
    ko,
    html,
    DynamicServiceClient,
    common
) {
    'use strict';

    var t = html.tag,
        div = t('div'),
        table = t('table'),
        tr = t('tr'),
        th = t('th'),
        td = t('td');

    function viewModel(params) {
        var runtime = params.runtime;

        var dnaLength = ko.observable();
        var contigCount = ko.observable();
        var gcContent = ko.observable();
        var externalSource = ko.observable();
        var externalSourceId = ko.observable();
        var externalSourceOriginationDate = ko.observable();

        var fetching = ko.observable(false);

        function fetchData() {
            fetching(true);
            var client = new DynamicServiceClient({
                url: runtime.config('services.service_wizard.url'),
                token: runtime.service('session').getAuthToken(),
                module: 'AssemblyAPI'
            });
            Promise.all([
                    client.callFunc('get_stats', [
                        params.item.meta.ids.ref
                    ]).spread(function (stats) {
                        return stats;
                    }),
                    client.callFunc('get_external_source_info', [
                        params.item.meta.ids.ref
                    ]).spread(function (result) {
                        return result;
                    })
                ])
                .spread(function (stats, sourceInfo) {
                    dnaLength(stats.dna_size);
                    contigCount(stats.num_contigs);
                    gcContent(stats.gc_content);
                    externalSource(sourceInfo.external_source);
                    externalSourceId(sourceInfo.external_source_id);
                    externalSourceOriginationDate(sourceInfo.external_source_origination_date);
                })
                .finally(function () {
                    fetching(false);
                });
        }

        fetchData();

        return {
            dnaLength: dnaLength,
            contigCount: contigCount,
            gcContent: gcContent,
            fetching: fetching,
            externalSource: externalSource,
            externalSourceId: externalSourceId,
            externalSourceOriginationDate: externalSourceOriginationDate
        };
    }

    function buildNutshell() {
        return table({
            class: '-table '
        }, [
            tr([
                th('DNA Length'),
                td({
                    dataBind: {
                        numberText: 'dnaLength',
                        numberFormat: '"0,0"'
                    }
                })
            ]),
            tr([
                th('Contig Count '),
                td({
                    dataBind: {
                        numberText: 'contigCount',
                        numberFormat: '"0,0"'
                    }
                })
            ]),
            tr([
                th('GC Content'),
                td({
                    dataBind: {
                        numberText: 'gcContent',
                        numberFormat: '"0%"'
                    }
                })
            ]),
            tr([
                th('External Source'),
                td({
                    dataBind: {
                        text: 'externalSource() || "-"'
                    }
                })
            ]),
            tr([
                th('Ext. Source Id'),
                td({
                    dataBind: {
                        text: 'externalSourceId() || "-"'
                    }
                })
            ]),
            tr([
                th('Ext. Source Orig. Date'),
                td({
                    dataBind: {
                        text: 'externalSourceOriginationDate() || "-"'
                    }
                })
            ])
        ]);
    }

    function template() {
        return div([
            '<!-- ko if: fetching -->',
            html.loading('Loading assembly stats...'),
            '<!-- /ko -->',
            '<!-- ko ifnot: fetching -->',
            buildNutshell(),
            '<!-- /ko -->'
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