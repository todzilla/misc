/* Javascript GCInit routines  
   Contact Tod Thomas @1234/tthomas@acme.com
   for questions/comments.
----------------------------------------------*/

//alert("Top of init...");

//Set up some globals 
//var facetArray = ['title', 'sbu', 'zone', 'country', 'dept', 'gckeywords', 'doctype'];
var facetArray = ['title', 'sbu', 'zone', 'country', 'dept', 'doctype'];

var titleArray = new Array();
var newTitleArray = new Array();
var zoneArray = new Array();
var sbuArray = new Array();
var countryArray = new Array();
var deptArray = new Array();
var doctypeArray = new Array();
var gckeywordsArray = new Array();

// This is set high specifically to prevent paging
var pageSize=1000000;
var queryString = "";
var self = this;
  var strURL = "http://home-p.acme.com/cgi-bin/solrProxyp.cgi";
//alert(strURL);
var xmlHttpReq = false;

var start=0;
var firstPage=0;
var lastPage=0;
var nextPage=0;
var prevPage=0;

/* Javascript GCControl routines  
   Contact Tod Thomas @1234/tthomas@acme.com
   for questions/comments.
----------------------------------------------*/

//--------------------------------------------------------------------
  function doControl(cParam) {
//--------------------------------------------------------------------
//alert("starting ....");

  // Number of options in the top dropdown box
  // see http://www.quirksmode.org/js/forms.html
  var idx=document.srchForm.titleSelect.options;

  var titleArray=document.srchForm.titleSelect;
  var keywordObj=document.srchForm.gckeywords;
  var zoneObj=document.srchForm.zoneSelect;
  var sbuObj=document.srchForm.sbuSelect;
  var countryObj=document.srchForm.countrySelect;
  var deptObj=document.srchForm.deptSelect;

/*
alert(keywordObj.value.length);
alert(zoneObj.options.length)
alert(sbuObj.options.length)
alert(countryObj.options.length)
alert(deptObj.options.length)
 
alert(idx.length);
alert(document.srchForm.titleSelect.selectedIndex);
*/

  $('#srchForm').hide();

  // if this is equal to 1 then we've never visited
  // the page so load up all the dropdowns 
  if(!(idx.length>1))
   {
    for(var i=0; i<facetArray.length; i++)
    {
     doDropDown(facetArray[i]);
    }
   }
  else
   {
//  document.getElementById("paging").innerHTML = '';
    doQuery(cParam);
   }

  $('#srchForm').show();

}


/* Javascript GCModel routines  
   Contact Tod Thomas @1234/tthomas@acme.com
   for questions/comments.
----------------------------------------------*/

//alert("Top of model..." + typeof($));
//--------------------------------------------------------------------
function doDropDown(facet) {
//--------------------------------------------------------------------
  var params = [
    'q=(-(('+facet+':All)OR('+facet+':ALL)OR('+facet+':all)))',
//  'q=' + facet + ':*',
    'wt=json',
    'indent=true',
    'rows=' + pageSize,
    'facet=true',
    'facet.mincount=1',
    'facet.sort=index',
    'facet.field=' + facet
  ];
  
  var queryString = params.join('&');
//alert(queryString);
//alert(strURL);
    $.ajax({
        type: 'POST',
        url:  strURL,
        async: false,
        cache: false,
        data: queryString,
        dataType: 'json',
        error: function(jqXHR, textStatus, errorThrown) { alert(textStatus + ":" + errorThrown + ":" + jqXHR.status ); },
        success:  function(data,status,request){
//alert("Processing "+ facet);
         loadArrays(data,facet);
         if(facet == 'title')
          {
//alert("doing viewTitle...");
           viewTitle(data,facet);
          }
         else
          {
           viewDropDown(data,facet);
          }
        }
    })
}

//--------------------------------------------------------------------
function loadArrays(rsp,facet) {
//--------------------------------------------------------------------
  var idx=1;
//alert("loading arrays..." +facet);

  if(rsp)
   {
    count=rsp.facet_counts.facet_fields[facet].length
   }
  else
   {
    return;
   }
//alert("count: " + count + " facet: " + facet);

  if(facet == 'title')
   {
    // Value the array of objects
    count=rsp.response.docs.length;
    for(ctr=0;ctr<count;ctr++)
     {
      if(rsp.response.docs[ctr].title.length==1)
       {
        titleArray[ctr] = {url:rsp.response.docs[ctr].content_url,title:rsp.response.docs[ctr].title[0]};
       }    
      else 
       {
        titleArray[ctr] = {url:rsp.response.docs[ctr].content_url,title:rsp.response.docs[ctr].title[1]};
       }
     }
    // Now sort them by title
    titleArray.sort(function(a,b) {
     var titleA=a.title.toLowerCase(), titleB=b.title.toLowerCase();

      if (titleA < titleB)
        return -1;

      if (titleA > titleB)
        return 1;
 
      return 0;
     });
//alert(titleArray[1].url +":"+ titleArray[1].title);
    return;
   }

  if(facet == 'zone')
   {
    for(ctr=0;ctr<count;(ctr=ctr+2))
     {
       zoneArray[idx] = rsp.facet_counts.facet_fields[facet][ctr];
       idx++;
     }
    return;
   }

  if(facet == 'sbu')
   {
    for(ctr=0;ctr<count;(ctr=ctr+2))
     {
       sbuArray[idx] = rsp.facet_counts.facet_fields[facet][ctr];
       idx++;
     }
    return;
   }

  if(facet == 'country')
   {
    for(ctr=0;ctr<count;(ctr=ctr+2))
     {
       countryArray[idx] = rsp.facet_counts.facet_fields[facet][ctr];
       idx++;
     }
    return;
   }

  if(facet == 'dept')
   {
    for(ctr=0;ctr<count;(ctr=ctr+2))
     {
       deptArray[idx] = rsp.facet_counts.facet_fields[facet][ctr];
       idx++;
     }
    return;
   }

  if(facet == 'gckeywords')
   {
    for(ctr=0;ctr<count;(ctr=ctr+2))
     {
       gckeywordsArray[idx] = rsp.facet_counts.facet_fields[facet][ctr];
       idx++;
     }
    return;
   }

  if(facet == 'doctype')
   {
    for(ctr=0;ctr<count;(ctr=ctr+2))
     {
       doctypeArray[idx] = rsp.facet_counts.facet_fields[facet][ctr];
       idx++;
     }
    return;
   }

}

//--------------------------------------------------------------------
function doQuery(start) {
//--------------------------------------------------------------------

 /* If user clicked on a document from the title dropdown just grab 
    its URL and display it in a popup 
 
    If anything was entered in the gckeywords field check to see if 
    anything was selected from the dropdowns.  If not just do an
    'everything' search.  

    Otherwise, fashion the appropriate filter and perform the search. 

 */ 

 var filterArray = new Array();
 var facetString = "";
 var filterString = "";
 var freeformString = "";
 var params = new Array();
 var queryString = "";
 var freeformObj=document.srchForm.freeform;
 
// alert("I'm in do query...");
//alert("gckeywords length: " + keywordObj.value.length);


 if((document.srchForm.zoneSelect.selectedIndex==0)&&
   (document.srchForm.sbuSelect.selectedIndex==0)&&
   (document.srchForm.countrySelect.selectedIndex==0)&&
   (document.srchForm.deptSelect.selectedIndex==0)&&
// (document.srchForm.gckeywordsSelect.selectedIndex==0)&&
   (document.srchForm.doctypeSelect.selectedIndex==0)) {
   filterArray.push("*:*");
 }
 else {

  if((document.srchForm.zoneSelect.selectedIndex==-1)||
  (document.srchForm.zoneSelect.selectedIndex==0)) 
   { 
//  filterArray.push("zone:*");
   }
  else
   {
    var work=zoneArray[(document.srchForm.zoneSelect.selectedIndex)];
    escape(work);
    work=work.replace(/&/g,'\%26');
    work=work.replace(/ /g,'\\+');
    work=work.replace(/\(/g,'\\(');
    work=work.replace(/\)/g,'\\)');
    filterArray.push("(zone:" + work + ")OR(zone:All)OR(zone:ALL)");
   }
 
  if((document.srchForm.sbuSelect.selectedIndex==-1)||
     (document.srchForm.sbuSelect.selectedIndex==0)) 
   {
//  filterArray.push("sbu:*");
   }
  else
   {
    var work=sbuArray[(document.srchForm.sbuSelect.selectedIndex)];
    escape(work);
    work=work.replace(/&/g,'\%26');
    work=work.replace(/ /g,'\\+');
    work=work.replace(/\(/g,'\\(');
    work=work.replace(/\)/g,'\\)');
    filterArray.push("(sbu:" + work + ")OR(sbu:All)OR(sbu:ALL)");
   }
 
  if((document.srchForm.countrySelect.selectedIndex==-1)||
     (document.srchForm.countrySelect.selectedIndex==0)) 
   {
//  filterArray.push("country:*");
   }
  else
   {
    var work=countryArray[(document.srchForm.countrySelect.selectedIndex)];
    escape(work);
    work=work.replace(/&/g,'\%26');
    work=work.replace(/ /g,'\\+');
    work=work.replace(/\(/g,'\\(');
    work=work.replace(/\)/g,'\\)');
    filterArray.push("(country:" + work + ")OR(country:All)OR(country:ALL)");
   }
 
  if((document.srchForm.deptSelect.selectedIndex==-1)||
     (document.srchForm.deptSelect.selectedIndex==0)) 
   {
    filterArray.push("dept:*");
   }
  else
   {
    var work=deptArray[(document.srchForm.deptSelect.selectedIndex)];
    escape(work);
    work=work.replace(/&/g,'\%26');
    work=work.replace(/ /g,'\\+');
    work=work.replace(/\(/g,'\\(');
    work=work.replace(/\)/g,'\\)');
    filterArray.push("(dept:" + work + ")OR(dept:All)OR(dept:ALL)");
   }
 
/*
  if((document.srchForm.gckeywordsSelect.selectedIndex==-1)||
     (document.srchForm.gckeywordsSelect.selectedIndex==0))
   {
//  filterArray.push("gckeywords:*");
   }
  else
   {
    var work=gckeywordsArray[(document.srchForm.gckeywordsSelect.selectedIndex)];
    escape(work);
    work=work.replace(/&/g,'\%26');
    work=work.replace(/ /g,'\\+');
    work=work.replace(/\(/g,'\\(');
    work=work.replace(/\)/g,'\\)');
    filterArray.push("(gckeywords:" + work + ")OR(gckeywords:All)OR(gckeywords:ALL)");
   }
*/
 
  if((document.srchForm.doctypeSelect.selectedIndex==-1)||
     (document.srchForm.doctypeSelect.selectedIndex==0))
   {
//  filterArray.push("doctype:*");
   }
  else
   {
    var work=doctypeArray[(document.srchForm.doctypeSelect.selectedIndex)];
    escape(work);
    work=work.replace(/&/g,'\%26');
    work=work.replace(/ /g,'\\+');
    work=work.replace(/\(/g,'\\(');
    work=work.replace(/\)/g,'\\)');
    filterArray.push("(doctype:" + work + ")OR(doctype:All)OR(doctype:ALL)");
   }
 }

 if(freeformObj.value.length>0)
  {
   freeformString = freeformObj.value;
  }

 // For our needs this will always be true ...
 if(filterArray.length > 0)
  {
    filterString = filterArray.join(")AND(");
    if(freeformString.length>0)
     {
      var gcString = freeformString.toLowerCase();
      freeformString = toUnicode(freeformString);
//    filterString = "q=(((" + freeformString + ")OR(text_cjk:"+ freeformString +"))AND(" + filterString + "))";

      filterString = "q=(((" + freeformString + ")           \
                         OR(gckeywords_lower:"+ gcString +")   \
                         OR(text_bra:"+ freeformString +")   \
                         OR(text_cjk:"+ freeformString +")   \
                         OR(text_dnk:"+ freeformString +")   \
                         OR(text_nld:"+ freeformString +")   \
                         OR(text_fra:"+ freeformString +")   \
                         OR(text_deu:"+ freeformString +")   \
                         OR(text_ita:"+ freeformString +")   \
                         OR(text_prt:"+ freeformString +")   \
                         OR(text_esp:"+ freeformString +")   \
                         OR(text_che:"+ freeformString +")   \
                         OR(text_tha:"+ freeformString +")   \
                        )AND(" + filterString + "))";
     }
    else
     {
      filterString = "q=((" + filterString + "))";
     }

    facetString = facetArray.join("&facet.field=");
    facetString = "facet.field=" + facetString;


/*
    alert(filterString);
    alert(facetString);
*/

    if(!start)
     {
      start=0;
     }
    
    params = [
      filterString,
      'facet=true',
      'facet.sort=index',
      facetString,
      'indent=true',
      'rows=' + pageSize,
      'start=' + start,
      'wt=json'
    ];

   queryString = params.join('&');
// alert("querystring: "+queryString);

  }
 else
  {
   //nop
  }

/*
  var message="";
  message+="using query string " + queryString;
  document.getElementById("message").innerHTML = message;
*/

    $.ajax({
//      type: 'GET',
        type: 'POST',
        url:  strURL,
        async: false,
        cache: false,
        data: queryString,
        success:  function(data,status,request){
         viewSearchResults(data);
        },
        dataType: 'json'
    })
}
/* Javascript GCView routines  
   Contact Tod Thomas @1234/tthomas@acme.com
   for questions/comments.
----------------------------------------------*/

//alert("Top of view...");
//--------------------------------------------------------------------
     function doPaging(rsp) {
//--------------------------------------------------------------------
//alert("doPaging facet " + facet);
       var html="";
       var numFound=rsp.response.numFound;
       var pages=Math.round(numFound/pageSize);
       
       start=rsp.response.start;
       nextPage=start+(pageSize);
       prevPage=start-(pageSize);
       lastPage=numFound-(pageSize);

       if(numFound>pageSize)
       {
         html+="<ul style=\"border:solid black 1px;display:block-inline;list-style:none;padding-left:46%;\">";                                             
         
         html+="<li style=\"float:left;list-style:none;padding-right: 10px;\">";
         html+="<a href=\"javascript:doControl(\'";
         html+="\')\" style=\"text-decoration:none;\" title=\"First Page\">&#60;&#60;</a><br />";
         html+="</li>"
         
         if(prevPage>=0)
          {
           html+="<li style=\"float:left;list-style:none;padding-right: 10px;\">";
           html+="<a href=\"javascript:doControl(\'";
           html+=prevPage;
           html+="\')\" style=\"text-decoration:none;\" title=\"Previous Page\">prev</a><br />";
           html+="</li>"
          }
         
         if(!(nextPage>=numFound))
          {
           html+="<li style=\"float:left;list-style:none;padding-right: 10px;\">";
           html+="<a href=\"javascript:doControl(\'";
           html+=nextPage;
           html+="\')\" style=\"text-decoration:none;\" title=\"Next Page\">next</a><br />";
           html+="</li>"
          }
         
         if(!(nextPage>=numFound))
          {
           html+="<li style=\"float:left;list-style:none;padding-right: 10px;\">";
           html+="<a href=\"javascript:doControl(\'";
           html+=lastPage;
           html+="\')\" style=\"text-decoration:none;\" title=\"Last Page\">&#62;&#62;</a><br />";
           html+="</li>"
          }
         
         html+="</ul>"; 
//       document.getElementById("paging").innerHTML = html;
       }
     }

//--------------------------------------------------------------------
 function loadLink(which){
//--------------------------------------------------------------------
  var i = which.selectedIndex;
  if (i != 0)
  {
    i--;
    var url = newTitleArray[i].url;
    openWindow(url);
  }
 }

//--------------------------------------------------------------------
function openWindow (url)
//--------------------------------------------------------------------
{
  popupWin = window.open(url,'remote');
}

//--------------------------------------------------------------------
 function viewDropDown(rsp,facet){
//--------------------------------------------------------------------
//alert("Top of viewDropDown...");
  var count=0;
  var entity="";
  var html="";
  var message="";
  var pgHtml="";
  var srchResults="";
  var work ="";

  var divId=facet + "Div";
  var formId=facet + "Form";
  var selectId=facet + "Select";

  // The select is already defined in the HTML
  var selectObj=document.getElementById(selectId);
  var optCnt=0


  if(rsp)
   {
    count=rsp.facet_counts.facet_fields[facet].length;
   }
  else
   {
    return;
   }

  selectObj.setAttribute('id',selectId);

//alert("Got back " + count + " facets...");

  for(i=0; i<count;(i=i+2)) 
    {
     var optionObj=document.createElement('option');
     menuItem=rsp.facet_counts.facet_fields[facet][i];
     menuVal=rsp.facet_counts.facet_fields[facet][i];
     if(((menuItem != " ")&&(menuItem != "")&&(menuItem != null))&&((menuItem != "All")&&(menuItem != "ALL")))
      {
//alert(menuItem);
       optionObj.appendChild(document.createTextNode(menuItem));
       optionObj.setAttribute('id',"optId" + optCnt);
       optionObj.setAttribute('value',menuVal);
       optCnt++;
       selectObj.appendChild(optionObj);
      }
    }
 }


//--------------------------------------------------------------------
 function viewSearchResults(rsp){
//--------------------------------------------------------------------

  var message="";
  var srchResults="";
  var myTitle="";


//doPaging(rsp);

  document.getElementById('message').style.display='';
  document.getElementById('srchResults').style.display='';
  document.getElementById('srchResults').style.borderWidth='2px';
//document.getElementById('srchResults').style.borderColor='black';
  document.getElementById('srchResults').style.borderStyle='inset';
  document.getElementById('srchResults').style.backgroundColor='white';

  srchResults+="<ul style=\"border:solid white 0px;list-style:none;margin:0em .5em 1em .5em;\">";
  if(rsp.response.docs.length>0)
   {
    // we got a facet query filter
    var ctr=0;
    var ctrInt=0;
    var newDesc="";
    var re="";
    var newArray = new Array();
    var resArray = new Array();
    var resIntArray = new Array();
    var regex = new RegExp("^[A-za-z]");
    var temp="";

    // For each result returned...
    for(i=0; i<rsp.response.docs.length;i++) 
     {
      if(rsp.response.docs[i].title.length==1)
       {
        myTitle = rsp.response.docs[i].title[0]
       }          
      else 
       {
        myTitle = rsp.response.docs[i].title[1]
       }

     if(regex.test(myTitle))
       {
        resArray[ctr]={formNo:rsp.response.docs[i].form_number,title:myTitle,url:rsp.response.docs[i].content_url};
        ctr++;
       }
     else
       {
        resIntArray[ctrInt]={formNo:rsp.response.docs[i].form_number,title:myTitle,url:rsp.response.docs[i].content_url};
        ctrInt++;
       }
     }

    /* Sort the 'english' array by title */
    resArray.sort(function(a, b){
     var titleA=a.title.toLowerCase(), titleB=b.title.toLowerCase()
     if (titleA < titleB) //sort string ascending
      return -1
     if (titleA > titleB)
      return 1
     return 0 //default return value (no sorting)
    })

    newArray = resArray.concat(resIntArray);

//alert(newArray.length+":"+resArray.length+":"+resIntArray.length);

    message+="Returned " + newArray.length + " Documents<br /><br />";
//  message+="using query string " + queryString;
    document.getElementById("message").innerHTML = message;

    for(i=0; i<newArray.length;i++) 
     {
      // Present entire result set to user               
      srchResults+="<li><a style=\"text-decoration:none\" target=\"_blank\"" +
      "href=\"" + newArray[i].url                                            +
      "\">"                                                                  +
      (start+i+1) + ".  " + newArray[i].title                                +

      "</li>";
     }
   }
  else
   {
     srchResults+="<li style=\"list-style:none;margin:2%;\">No results to display for this selection</li>";
   }

  srchResults+="</ul>"
  
  // Value the DOM ID with the markup
  document.getElementById("srchResults").innerHTML = srchResults;

 }


//--------------------------------------------------------------------
 function viewTitle(rsp,facet){
//--------------------------------------------------------------------
  var count=0;
  var ctr=0;
  var ctrInt=0;
  var entity="";
  var html="";
  var i=0;
  var message="";
  var pgHtml="";
  var regex = new RegExp("^[A-za-z]");
  var regexInt = new RegExp("^[^A-za-z]");
  var newArray = new Array();
  var resArray = new Array();
  var resIntArray = new Array();
  var srchResults="";
  var work ="";

  var divId=facet + "Div";
  var formId=facet + "Form";
  var selectId=facet + "Select";

  // The select is already defined in the HTML
  var selectObj=document.getElementById(selectId);
  selectObj.setAttribute('id',selectId);

  for(i in titleArray)
    {
     menuItem=titleArray[i].title;
     menuVal=titleArray[i].url;

     if(regex.test(menuItem))
       {
//alert("cnt: " + ctr + "title: " + menuItem + "url: " + menuVal);
        resArray[ctr]={title:menuItem,url:menuVal};
        ctr++;
       }
     else
       {
//alert("cnt: " + ctrInt + "title: " + menuItem + "url: " + menuVal);
        resIntArray[ctrInt]={title:menuItem,url:menuVal};
        ctrInt++;
       }
    }

    newTitleArray = resArray.concat(resIntArray);

    for(i=0; i<newTitleArray.length;i++)
      {
       var optionObj=document.createElement('option');
       menuItem=newTitleArray[i].title;
       menuVal=newTitleArray[i].url;

       optionObj.innerHTML = menuItem;
       optionObj.setAttribute('id',"optId" + i);
       optionObj.setAttribute('target',"_blank");
       optionObj.setAttribute('value',menuVal);
       selectObj.appendChild(optionObj);
      }
    }

//--------------------------------------------------------------------
function toUnicode(theString) {
//--------------------------------------------------------------------
  var unicodeString = '';
  for (var i=0; i < theString.length; i++) {
    var theUnicode = theString.charCodeAt(i).toString(16).toUpperCase();
    while (theUnicode.length < 4) {
      theUnicode = '0' + theUnicode;
    }
    theUnicode = '\\u' + theUnicode;
    unicodeString += theUnicode;
  }
  return unicodeString;
}
