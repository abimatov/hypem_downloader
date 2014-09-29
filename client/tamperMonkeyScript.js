// ==UserScript==
// @name       Hypem downloader
// @namespace  http://use.i.E.your.homepage/
// @version    0.1
// @description  enter something useful
// @match      http://hypem.com/
// @copyright  2012+, You
// ==/UserScript==

console.log('Hypem downloader loaded');
setTimeout(function(){
    $.each($('.haarp-fav-ctrl'), function(i, e){
        var self = $(e);
        var id = self.attr('id');
        if(id.indexOf('fav_item_') < 0) return true;
        id = id.replace('fav_item_','');
        if(id === '') return true;
        
        console.log(id);
        var track = getTrackFromDisplayList(id);
        var downloadUrl = 'http://hypem.com/serve/source/' 
        + track.id + '/' + track.key;
        console.log(downloadUrl);
        
        $.getJSON(downloadUrl, function(data){            
            var _track = getTrackFromDisplayList(data.itemid);
            console.log(_track);
            self.click(function(ev){
				if($(ev.target).closest('.haarp-fav-ctrl').hasClass('fav-on')) {
                	return;
                }
                
                $.ajax({
                  url: 'http://127.0.0.1:8000',
                  type: 'POST',
                  data: JSON.stringify($.extend(_track, { downloadUrl: data.url }))
                });
            });
        });
    });
}, 2000);

var getTrackFromDisplayList = function(trackId){
    return $.grep(displayList.tracks, function(e, i){
    	return e.id === trackId;
    })[0];
};