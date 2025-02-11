var REFERENCE_CHOOSER_MODAL_ONLOAD_HANDLERS = {
    chooser: function(modal, jsonData) {
        const Cite = require('citation-js')
        function renderCite(context) {
            $('a div.preview', context).html(function() {
                const citation = new Cite(this.attributes.data.value)
                const outputHtml = citation.format('bibliography', {
                    format: 'html',
                    template: 'apa',
                    lang: 'en-US'
                })
                return outputHtml;
            });
        }

        var searchUrl = $('form.reference-search', modal.body).attr('action');

        var currentTag;

        function ajaxifyLinks(context) {
            $('.listing a', context).click(function() {
                modal.loadUrl(this.href);
                return false;
            });

            $('.pagination a', context).click(function() {
                var page = this.getAttribute('data-page');
                setPage(page);
                return false;
            });
        }

        function fetchResults(requestData) {
            $.ajax({
                url: searchUrl,
                data: requestData,
                success: function(data, status) {
                    $('#image-results').html(data);
                    ajaxifyLinks($('#image-results'));
                }
            });
        }

        function search() {
            /* Searching causes currentTag to be cleared - otherwise there's
            no way to de-select a tag */
            currentTag = null;
            fetchResults({
                q: $('#id_q').val(),
                collection_id: $('#collection_chooser_collection_id').val()
            });
            return false;
        }

        function setPage(page) {
            var params = { p: page };
            if ($('#id_q').val().length) {
                params['q'] = $('#id_q').val();
            }
            if (currentTag) {
                params['tag'] = currentTag;
            }
            params['collection_id'] = $('#collection_chooser_collection_id').val();
            fetchResults(params);
            return false;
        }

        ajaxifyLinks(modal.body);
        renderCite(modal.body);

        $('form.reference-search', modal.body).submit(search);

        $('#id_q').on('input', function() {
            clearTimeout($.data(this, 'timer'));
            var wait = setTimeout(search, 200);
            $(this).data('timer', wait);
        });
        $('#collection_chooser_collection_id').change(search);
        $('a.suggested-tag').click(function() {
            currentTag = $(this).text();
            $('#id_q').val('');
            fetchResults({
                tag: currentTag,
                collection_id: $('#collection_chooser_collection_id').val()
            });
            return false;
        });
    },

    reference_chosen: function(modal, jsonData) {
        modal.respond('referenceChosen', jsonData['result']);
        modal.close();
    },
};
