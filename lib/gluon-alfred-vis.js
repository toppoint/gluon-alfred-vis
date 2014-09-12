      var nodes = {};
      var arr = [];
      var sortProp = 'hostname';
      var sortType = 'str';
      var sortAsc = true;

      function showResults () {
        var html = '';
        for (var e in arr) {
          html += '<tr>'
            +'<td><a target="_blank" href="http://['+arr[e].address+']/">'+arr[e].hostname+'</a></td>'
            +'<td align="right">'+(arr[e].uptime === undefined ? '' : Math.floor(arr[e].uptime/3600))+'</td>'
            +'<td align="right">'+(arr[e].tx === undefined ? '' : Math.floor(arr[e].tx/1048576))+'</td>'
            +'<td align="right">'+(arr[e].tx === undefined ? '' : Math.floor(arr[e].rx/1048576))+'</td>'
            +'<td>'+(arr[e].firmware === undefined ? '' : arr[e].firmware)+'</td>'
            +'<td>'+(arr[e].model === undefined ? '' : arr[e].model)+'</td>'
            +'<td>'+(arr[e].autoupdate === undefined ? '' : arr[e].autoupdate)+'</td>'
            +'<td>'+arr[e].contact+'</td>'
            +'<td>'+(arr[e].longitude === undefined ? '' : arr[e].longitude.toFixed(5))+'</td>'
            +'<td>'+(arr[e].latitude === undefined ? '' : arr[e].latitude.toFixed(5))+'</td>'
            +'</tr>';
        }
        $('#results').html(html);
      }

      function order(c) {
        if (/^\d$/.test(c))
          return 0;
        else if (/^[a-z]$/i.test(c))
          return c.charCodeAt(0);
        else if (c === '~')
          return -1;
        else if (c)
          return c.charCodeAt(0) + 256;
        else
          return 0;
      }

      function t(vpos,v) {
        return (vpos < v.length && !/^\d$/.test(v[vpos]));
      }

      // Based on dpkg code
      function vercomp(a, b) {
        var apos = 0, bpos = 0;
        if (a === undefined)
          a = 0;
        if (b === undefined)
          b = 0;
        while (apos < a.length || bpos < b.length) {
          var first_diff = 0;

          while (t(apos,a) || t(bpos,b)) {
            var ac = order(a[apos]);
            var bc = order(b[bpos]);

            if (ac !== bc)
              return ac - bc;

            apos++;
            bpos++;
          }

          while (a[apos] === '0')
            apos++;
          while (b[bpos] === '0')
            bpos++;

          while (/^\d$/.test(a[apos]) && /^\d$/.test(b[bpos])) {
            if (first_diff === 0)
              first_diff = a.charCodeAt(apos) - b.charCodeAt(bpos);

            apos++;
            bpos++;
          }

          if (/^\d$/.test(a[apos]))
            return 1;

          if (/^\d$/.test(b[bpos]))
            return -1;

          if (first_diff !== 0)
            return first_diff;
        }

        return 0;
      }

      function compare(a, b) {
        if (a < b)
          return -1;
        else if (a > b)
          return 1;
        else
          return 0;
      }

      function strcompare(a, b) {
        try { a = a.toUpperCase(); } catch (e) { a = ""; }
        try { b = b.toUpperCase(); } catch (e) { b = ""; }
        return compare(a, b);
      }

      function sortResults() {
        arr = [];
        Object.keys(nodes).forEach(function(key){arr.push(nodes[key]);});
        for (var i = 0; i < arr.length; i++) {
          arr[i].pos = i;
        }

        arr = arr.sort(function(a, b) {
          var ret;

          if (sortType === 'ver')
            ret = vercomp(a[sortProp], b[sortProp]);
          else if (sortType === 'str')
            ret = strcompare(a[sortProp], b[sortProp]);
          else
            ret = compare(a[sortProp], b[sortProp]);

          if (ret == 0)
            ret = compare(a.pos, b.pos);

          return sortAsc ? ret : -ret;
        });
        showResults();
      }

      function reload() {
        $.getJSON('alfred-158.json', function(data) {
          $.each( data, function( key,val ) {
            if (!nodes[key]) nodes[key]={};
            try { nodes[key].hostname = val['hostname'];                                                            } catch (e) {};
            try { nodes[key].address = val['network']['addresses'][0];                                              } catch (e) {};
            try { nodes[key].uptime = val['statistics']['uptime'];                                                  } catch (e) {};
            try { nodes[key].tx = val['statistics']['traffic']['tx']['bytes'];                                      } catch (e) {};
            try { nodes[key].rx = val['statistics']['traffic']['rx']['bytes'];                                      } catch (e) {};
            try { nodes[key].firmware = val['software']['firmware']['release'];                                     } catch (e) {};
            try { nodes[key].model = val['hardware']['model'];                                                      } catch (e) {};
            try { nodes[key].autoupdate = (val.software.autoupdater.enabled?val.software.autoupdater.branch:false); } catch (e) {};
            try { nodes[key].contact = ('owner' in val?val['owner']['contact']:'');                                 } catch (e) {};
            try { nodes[key].longitude = val['location']['longitude'];                                              } catch (e) {};
            try { nodes[key].latitude = val['location']['latitude'];                                                } catch (e) {};
          });
          sortResults();
        });
        $.getJSON('alfred-159.json', function(data) {
          $.each( data, function( key,val ) {
            if (!nodes[key]) nodes[key]={};
            try { nodes[key].uptime = val['uptime'];             } catch (e) {};
            try { nodes[key].tx = val['traffic']['tx']['bytes']; } catch (e) {};
            try { nodes[key].rx = val['traffic']['rx']['bytes']; } catch (e) {};
          });
          sortResults();
        });
      }


      $(function() {
        $('#headings th').click(function() {
          if (sortProp == $(this).attr('id'))
            // switch the sort direction
            sortAsc = !sortAsc;
          else
            sortAsc = true;
          sortProp = $(this).attr('id');
          sortType = $(this).attr('sort');

          sortResults();
        });
        reload();
      });
