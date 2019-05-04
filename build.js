document.addEventListener("DOMContentLoaded", function(){
    var content_div = document.getElementById("content");
    var cat_template = document.getElementById("temp_cat");

    //Obtain categories and load them
    fetch("cats.json").then(function(response){
        return response.json();
    }).then(function(blocks){
        for(var i = 0; i < blocks.length; i++){
            //Create category blocks
            var block = blocks[i];
            var block_div = create_div("cat_block");

            //Create columns
            var col_divs = [];
            for(var col = 0; col < block.cols; col++){
                col_div = create_div("cat_group");
                col_divs.push(col_div);
                block_div.appendChild(col_div);
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
                col_divs[col%block.cols].appendChild(cat_div);
                col++;
            }
            content_div.appendChild(block_div);
        }

        content_div.style.opacity = 1;
    });
});

function create_div(class_name = null){
    var div = document.createElement("div");
    if(class_name) div.classList.add(class_name);
    return div;
}
