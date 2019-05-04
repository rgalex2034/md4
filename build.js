document.addEventListener("DOMContentLoaded", function(){
    var content_div = document.getElementById("content");
    var blocks_div = content_div.getElementsByClassName("blocks")[0];
    var cat_template = document.getElementById("temp_cat");

    //Obtain categories and load them
    fetch("cats.json").then(function(response){
    //Promise.resolve().then(function(){
        //return [];
        return response.json();
    }).then(function(blocks){
        for(var i = 0; i < blocks.length; i++){
            //Create category blocks
            var block = blocks[i];
            var block_div = create_cat_block();

            //Create columns
            var col_divs = [];
            for(var col = 0; col < block.cols; col++){
                col_div = create_cat_group();
                col_divs.push(col_div);
                block_div.getElementsByClassName("cat_block")[0].appendChild(col_div);
            }

            //Create and append categories
            var col = 0;
            for(var name in block.cats){
                var links = block.cats[name];
                var cat_div = document.importNode(cat_template.content.children[0], true);
                cat_div.getElementsByClassName("name")[0].innerText = name;
                //Create and append links
                for(var link_name in links){
                    var link_a = document.createElement("a");
                    link_a.setAttribute("href", links[link_name]);
                    link_a.innerText = link_name;
                    cat_div.getElementsByClassName("links")[0].appendChild(link_a);
                }

                //Append categories to columns
                col_divs[col%block.cols].getElementsByClassName("cat_group")[0].appendChild(cat_div);
                col++;
            }
            blocks_div.appendChild(block_div);
        }

        content_div.style.opacity = 1;
    });

    //Toggle edition blocks
    document.getElementById("edit-button").addEventListener("click", function(){
        var edit_elements = document.getElementsByClassName("edit");
        for(element of edit_elements){
            element.style.display = element.style.display == "block" ? "none" : "block";
        }
    });
});

function create_div(class_name = null){
    var div = document.createElement("div");
    if(class_name) div.classList.add(class_name);
    return div;
}

function create_cat_block(){
    return copy_template("temp_block");
}

function create_cat_group(){
    return copy_template("temp_group");
}

function copy_template(id){
    var temp_block = document.getElementById(id);
    return document.importNode(temp_block.content.children[0], true);
}

var Cookie = {
    read: function(name = null){
        var data = {};
        var cookies = document.cookie;
        cookie_list = cookies.split("; ");
        cookie_list.forEach(function(cookie){
            var pair = cookie.split("=");
            data[pair[0]] = pair[1];
        });
        return name ? data[name] : data;
    },
    write: function(key, data, expiration = null){
        var cookie = key + "=" + data;
        if(expiration instanceof Date) cookie += "; expires=" + expiration.toString();
        document.cookie = cookie;
    },
    delete: function(key){
        var cookie = key + "=; expires=" + (new Date("1990-01-01"));
        document.cookie = cookie;
    }
}
