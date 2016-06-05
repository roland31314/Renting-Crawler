const _ = require('lodash')
require('jquery-ui')

if ( typeof module === "object" && typeof module.exports === "object" ) {
  window.$ = window.jQuery = require('jquery');
} else {
  
}

function R591(init_obj){
  let data_591 = []
  let data_591_id = {
    old : [],
    new : []
  }
  let option = init_obj
  let have_found = false
  
  this.setOption = function(opt){
    option = _.merge(option, opt)
    console.log(option)
  }
  
  this.start = function(){
    if(have_found == false){
      data_591 = []
      clearHTML()
      get_591_data()
    }
  }
  
  this.looked = function(){
    data_591_id.old = data_591_id.new
    option.old_mount.append(option.new_mount.children())
    have_found = false
  }
  
  this.reset = function(){
    data_591 = []
    clearHTML()
    data_591_id = {
      old : [],
      new : []
    }
    have_found = false
  }
  
  function get_591_data(){
    const url = 'https://rent.591.com.tw/index.php'
    let data = option.req_obj
    
    data.firstRow = data_591.length * 20
    
    $.ajax({
      url: url,
      data: data,
      dataType: 'html'
    }).done(function(data) {
      data_591.push(JSON.parse(data).main)
      
      if(data_591.length < option.times)
        get_591_data()
      else
        render()
    })
  }

  function render(data){
    let all_html = ""
    data_591_id.new = []
    
    data_591.map((html) => {
      if(!$(html).eq(0).hasClass("noData")){
       all_html += html
      }
    })
    
    let $all_html = $("<div>" + all_html + "</div>")
    $all_html.find("a").each( function(){
      let a = $(this)
      a.attr("href",  "https://rent.591.com.tw/" + a.attr("href"))
    })
    
    $all_html.find(".shInfo .left").each( function(){
      const id = $(this).data("bind")
      data_591_id.new.push(id)
      $(this).parents(".shList").attr("id", id)
    })
    
    const diff = _.difference(data_591_id.new, data_591_id.old )
    let new_obj = '<p>~~沒有新房間~~ ' + new Date().toLocaleString() + '</p>'
    
    if(diff.length > 0){
      new_obj = $all_html.children().filter(function( index ) {
        return diff.indexOf(parseInt(this.id)) >= 0
      })
      
      if(data_591_id.old.length > 0){
        have_found = true
        alert("找到 " + diff.length + " 筆新房間~")
      }
    }
    
    option.new_mount.append(new_obj)
    option.old_mount.append($all_html)
  }
  
  function clearHTML(){
    option.old_mount.children().remove()
    option.new_mount.children().remove()
  }
}

function jquery_ui_init(){
  $( "#list-container" ).tabs();
  $( "input[type=submit], a, button" ).button()
}

function getElement(){
  return {
    price_start   : $("#price_start"),
    price_end     : $("#price_end"),
    space_start   : $("#space_start"),
    space_end     : $("#space_end"),
    page          : $("#page"),
    old_mount     : $("#591_old_list"),
    new_mount     : $("#591_new_list"),
    loop_time     : $("#loop_time"),
    find          : $("#find"),
    find_loop     : $("#find_loop"),
    looked        : $("#looked"),
    reset         : $("#reset")
  }
}

$(document).ready(() => {
  let time_id = 0
  const el = getElement()
  
  jquery_ui_init()
  
  const r591 = new R591({
    req_obj : {
      module      : 'search',
      action      : 'rslist',
      is_new_list : 1,
      type        : 1,
      searchtype  : 1,
      region      : 1,
      order       : 'posttime',
      orderType   : 'desc'
    }
  })
 
  el.find.click(() => {
    r591.setOption({
      req_obj : {
        rentprice   : el.price_start.val() + "," + el.price_end.val(),
        area        : el.space_start.val() + "," + el.space_end.val()
      },
      times         : el.page.val(),
      old_mount     : el.old_mount,
      new_mount     : el.new_mount
    })
    r591.start()
  })
  
  el.find_loop.click(() => {
    time_id = setInterval(()=>{
      r591.setOption({
        req_obj : {
          rentprice   : el.price_start.val() + "," + el.price_end.val(),
          area        : el.space_start.val() + "," + el.space_end.val()
        },
        times         : el.page.val(),
        old_mount     : el.old_mount,
        new_mount     : el.new_mount
      })
      
      r591.start()
    }, parseInt(el.loop_time.val()) * 1000 )
  })
  
  el.looked.click(() => {
    r591.looked()
  })
  
  el.reset.click(() => {
    clearTimeout(time_id)
    r591.reset()
  })
})
