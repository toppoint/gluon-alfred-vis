      var nodes = {};
      var arr = [];

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

      // Based on dpkg code
      function vercomp(a, b) {
        var apos = 0, bpos = 0;
        while (apos < a.length || bpos < b.length) {
          var first_diff = 0;

          while ((apos < a.length && !/^\d$/.test(a[apos])) || (bpos < b.length && !/^\d$/.test(b[bpos]))) {
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
        try {
          a = a.toUpperCase();
          b = b.toUpperCase();
        } catch (e) {}

        if (a == b) return 0;
        else if (a > b) return 1;
        else return -1;
      }

      function showResults () {
        var html = '';
        for (var e in arr) {
          html += '<tr>'
            +'<td><a target="_blank" href="http://['+arr[e].address+']/">'+arr[e].hostname+'</a></td>'
            +'<td>'+Math.floor(arr[e].uptime/3600)+'h</td>'
            +'<td>'+Math.floor(arr[e].tx/1048576)+'</td>'
            +'<td>'+Math.floor(arr[e].rx/1048576)+'</td>'
            +'<td>'+arr[e].firmware+'</td>'
            +'<td>'+arr[e].model+'</td>'
            +'<td>'+arr[e].autoupdate+'</td>'
            +'<td>'+arr[e].contact+'</td>'
            +'<td>'+arr[e].longitude+'</td>'
            +'<td>'+arr[e].latitude+'</td>'
            +'</tr>';
        }
        $('#results').html(html);
      }

      function sortResults(prop, asc) {
        arr = [];
        Object.keys(nodes).forEach(function(key){arr.push(nodes[key]);});
        for (var i = 0; i < arr.length; i++) {
          arr[i].pos = i;
        }

        arr = arr.sort(function(a, b) {
          var ret;

          if (prop === 'firmware' || prop === 'model')
            ret = vercomp(a[prop], b[prop]);
          else
            ret = compare(a[prop], b[prop]);

          if (ret == 0) ret = compare(a.pos, b.pos);

          return asc ? ret : -ret;
        });
        showResults();
      }

      $(function() {
        $.getJSON('alfred-158.json', function(data) {
          $.each( data, function( key,val ) {
            if (!nodes[key]) nodes[key]={};
            try { nodes[key].hostname = val['hostname'];                                                         } catch (e) {};
            try { nodes[key].address = val['network']['addresses'][0];                                           } catch (e) {};
            try { nodes[key].uptime = parseFloat(val['statistics']['uptime']);                                   } catch (e) {};
            try { nodes[key].tx = parseFloat(val['statistics']['traffic']['tx']['bytes']);                       } catch (e) {};
            try { nodes[key].rx = parseFloat(val['statistics']['traffic']['rx']['bytes']);                       } catch (e) {};
            try { nodes[key].firmware = val['software']['firmware']['release'];                                  } catch (e) {};
            try { nodes[key].model = val['hardware']['model'];                                                   } catch (e) {};
            try { nodes[key].autoupdate = (val.software.autoupdater.enabled?val.software.autoupdater.branch:''); } catch (e) {};
            try { nodes[key].contact = ('owner' in val?val['owner']['contact']:'');                              } catch (e) {};
            try { nodes[key].longitude = ('location' in val?val['location']['longitude']:'');                    } catch (e) {};
            try { nodes[key].latitude = ('location' in val?val['location']['latitude']:'');                      } catch (e) {};
          });
          sortResults('hostname', true);
        });
        $.getJSON('alfred-159.json', function(data) {
          $.each( data, function( key,val ) {
            if (!nodes[key]) nodes[key]={};
            try { nodes[key].uptime = parseFloat(val['uptime']);                                   } catch (e) {};
            try { nodes[key].tx = parseFloat(val['traffic']['tx']['bytes']);                       } catch (e) {};
            try { nodes[key].rx = parseFloat(val['traffic']['rx']['bytes']);                       } catch (e) {};
          });
          sortResults('hostname', true);
        });

        $('#headings th').click(function() {
          var id = $(this).attr('id');
          var asc = (!$(this).attr('asc')); // switch the order, true if not set

          // set asc="asc" when sorted in ascending order
          $('#headings th').each(function() {
            $(this).removeAttr('asc');
          });
          if (asc)
            $(this).attr('asc', 'asc');

          sortResults(id, asc);
        });
      });
