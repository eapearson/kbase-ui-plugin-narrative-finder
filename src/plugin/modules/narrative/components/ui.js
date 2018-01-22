/*
    Overall UI for the RESKE Narrative Search
*/
define([
    'knockout-plus',
    'kb_common/html',
    './resultsBrowser',
    './controls'
], function (
    ko,
    html,
    ResultsBrowserComponent,
    ControlsComponent
) {
    'use strict';

    var t = html.tag,
        div = t('div');

    function viewModel(params) {

        return {
            searchVM: params.searchVM
        };
    }

    function template() {
        return div({}, [
            div([
                div({
                    dataBind: {
                        component: {
                            name: ControlsComponent.quotedName(),
                            params: {
                                searchVM: 'searchVM'
                            }
                        }
                    }
                })
            ]),
            div([
                div({
                    dataBind: {
                        component: {
                            name: ResultsBrowserComponent.quotedName(),
                            params: {
                                searchVM: 'searchVM'
                            }
                        }
                    }
                })
            ])
        ]);
    }

    function component() {
        return {
            viewModel: viewModel,
            template: template()
        };
    }
    return ko.kb.registerComponent(component);
});