var categories;

document.addEventListener("DOMContentLoaded", function(){
    //Obtain categories and load them
    fetch("cats.json").then(function(response){
    //Promise.resolve().then(function(){
        //return [];
        return response.json();
    }).then(function(blocks){
        categories = new Categories(blocks);
        categories.build();

        //Toggle edition blocks
        document.getElementById("edit-button").addEventListener("click", () => categories.toggleEdit());
    });
});

function Categories(blocks){
    this.blocks = blocks instanceof Array ? blocks : [];
    this.edition = false;
}

Categories.prototype.addBlock = function(columns = 1, categories = {}){
    this.blocks.push({
        cols: columns,
        cats: categories
    });
};

Categories.prototype.setColumns = function(block_num, cols){
    this.blocks[block_num].cols = cols;
};

Categories.prototype.addCategory = function(block_num, name, links = {}){
    this.blocks[block_num].cats[name] = links;
};

Categories.prototype.setLink = function(block_num, cat_name, link_name, link){
    this.blocks[block_num].cats[cat_name][link_name] = link;
};

Categories.prototype.toggleEdit = function(active = null){
    var active = active != null ? active : !this.edition;
    var edit_elements = document.getElementsByClassName("edit");
    for(element of edit_elements){
        element.style.display = active ? "block" : "none";
    }
    this.edition = active;
    console.log(this.edition);
};

Categories.prototype.build = function(){
    var content_div = document.getElementById("content");
    var blocks_div = content_div.getElementsByClassName("blocks")[0];
    var cat_template = document.getElementById("temp_cat");
    var blocks = this.blocks;

    //Clear actual categories
    while(blocks_div.hasChildNodes()) blocks_div.removeChild(blocks_div.lastChild);

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

    this.toggleEdit(this.edition);
    content_div.style.opacity = 1;
};

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
    read: function(key = null){
        var data = {};
        var cookies = document.cookie;
        cookie_list = cookies.split("; ");
        cookie_list.forEach(function(cookie){
            var pair = cookie.split("=");
            data[pair[0]] = pair[1];
        });
        return key ? data[name] : data;
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
