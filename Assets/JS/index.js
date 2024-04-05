let catitem = []
let table;
let nestedtable;
let upID;
table = $('#deatils').DataTable({
    data : catitem,
    columns : [
        {className: 'dt-control',
        orderable: false,
        data: null,
        defaultContent: ''},
        {data : "categoryname"},
        {data : "catdescription"},
        {data : "active"},
        {data :"launchdate",
        render : function(data) {
            if((new Date(data)/(1000 * 3600 * 24)+ 7) < (new Date()/(1000 * 3600 * 24) )){
                return "old"
            }
            else{
                return "New"
            }
        }
        },
        {data : null,
        "defaultContent" : `<button type="button" class="btn btn-primary" onclick="edit(this)" data-bs-toggle="modal" data-bs-target="#modalId">Edit</button><button type="button" class="btn btn-danger" onclick='deletedata(this)'>Delete</button>`}
    ]

});

let temp = `

<div class="text-center mt-3">
    <h1>Item</h1>
</div>
<table class="table " id="nesteditem">
<thead>
    <tr>
    <th>Number</th>
    <th scope="col">Item Name</th>
    <th scope="col">Item Description</th>
    <th scope="col">Food type</th>
    <th scope="col">Price</th>
    <th scope="col">Discount</th>
    <th scope="col">Discounted price</th>
    <th scope="col">Active</th>
    </tr>
</thead>
<tbody>
<tfoot>
    <tr>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
    </tr>
</tfoot>
</tbody>
</table>
`;
$('.nesteddetails').on('click','td.dt-control',function(e){
    
    let a = $(this).closest('tr');
    let row = table.row(a).index();
    let tablechild = table.row(row);
    console.log(row)
    let nesteddata = catitem[row].item;
    if(tablechild.child.isShown()){
        tablechild.child.hide();
    }
    else{
        tablechild.child(temp).show();
        nestedtable = $(tablechild.child()).find("#nesteditem").DataTable({
            searching:false,
            paging:false,
            info : false,
            data : nesteddata,
            columns : [
                {data : "itemname",
            render : function(data,type,row,meta){
                    return meta.row + 1
            }},
                {data: 'itemname'},
                {data : "itemdescription"},
                {data : "foodtype"},
                {data :"price",
                render : function(data,row,type){
                    return  parseFloat(data).toFixed(2)         
            }},
                {data : "discount"},
                {data : null,
            render : function(data,row,type){
                    return parseFloat(data.price) * parseFloat(data.discount)/100
                    
            }},
                {data : "active"}
            ],
            "footerCallback": function (tr, data, start, end, display) {                
                                    let totalAmount = 0;
                                    let finalAmount = 0;
                                    for (var i = 0; i < data.length; i++) {
                                        totalAmount += parseFloat(data[i].price);  
                                        finalAmount += parseFloat(data[i].price) - parseFloat(data[i].price) * parseFloat(data[i].discount)/100
                                    }
                                    $(tr).find('th').eq(0).html("Total");
                                    $(tr).find('th').eq(4).html(totalAmount.toFixed(2));
                                    $(tr).find('th').eq(6).html(finalAmount.toFixed(2));
                                }
        });
       
    }
})

function addinputrow(){
    if( document.getElementById('item').rows.length < 10 ){
                let row = 
                        `<tr class="">
                        <td scope="row"><input type="text" class="form-control"
                                name="itemname" id="itemname" aria-describedby="helpId"
                                placeholder="" required/>
                                <div class="invalid-feedback">Pease Enter Valida Name</div>
                            </td>
                        <td scope="row"><input type="text" class="form-control"
                                name="itemdescription" id="itemdescription"
                                aria-describedby="helpId" placeholder="" /></td>
                        <td scope="row">
                            <div class="mb-3">
                                <select class="form-select" name="foodtype" id="foodtype">
                                    <option>Dairy food</option>
                                    <option>Sea food</option>
                                    <option>Vegan</option>
                                    <option selected>Veg</option>
                                    <option>Nonveg</option>
                                </select>
                            </div>
                        </td>
                        <td scope="row"><input type="number" min="0" step="0.01" class="form-control" name="price" id="price" aria-describedby="helpId" placeholder="" required/> <div class="invalid-feedback">This field is required</div></td>
                        <td scope="row"><input type="number" min="0" max="15" step="0.01" class="form-control" name="discount" id="discount" aria-describedby="helpId" placeholder="" required/><div class="invalid-feedback">This field is required</div></td>
                        <td scope="row"><input type="number" min="0" step="0.01" class="form-control" name="gst" id="gst" aria-describedby="helpId" placeholder="" required/><div class="invalid-feedback">This field is required</div></td>
                        <td scope="row"><input class="form-check-input" type="checkbox" value="yes" id="active" checked required /></td>
                        <td scope="row"><button type="button" class="btn btn-dark" onclick='deleterow(this)'>-</button></td>
                    </tr>
                    `
            document.getElementById('item').insertAdjacentHTML("beforeEnd",row);
         
    }else{
        alert("you can add only 10 items")
    }
}
function deleterow(e){
    let a = e.parentNode.parentNode.rowIndex;
    document.getElementById('item').deleteRow(a-1);

}
function checkdate(){
    if(new Date(document.getElementById('launchdate').value) < new Date()){
        document.getElementById('launchdate').setCustomValidity("");
    }else{
        document.getElementById('launchdate').setCustomValidity("invalid");
    }
}

let form = document.getElementById("form");
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    if(!form.checkValidity()){
        e.preventDefault();
        e.stopPropagation();
        form.classList.add('was-validated');
    }
    else{
        let cateitems = {
            categoryname : document.getElementById("categoryname").value,
            catdescription : document.getElementById("catdescription").value,
            active : document.getElementById("active").value,
            launchdate : document.getElementById("launchdate").value,
            item:[]
        }

        document.querySelectorAll('#item tr').forEach((element)=>{
            let key = {
            }
           
            Array.from(element.getElementsByTagName('input')).forEach((e)=>{
               key[e.id] = e.value;
            })
            key["foodtype"] = element.getElementsByTagName('select')[0].value;
            cateitems.item.push(key);
           
        })
        if(upID >= 0)
        {
            console.log(upID)
                catitem[upID] = cateitems;
                table.row(upID).data(cateitems).draw();
                if(nestedtable){
                    nestedtable.clear().rows.add(cateitems.item).draw();
                }
                upID = null;
        }
        else{
            catitem.push(cateitems);
            table.row.add(cateitems).draw();
        }
        $("#modalId").modal('hide');
        $("#form").trigger('reset');
        form.classList.remove('was-validated');
        // console.log(cateitems)
        $("#item tr:gt(0)").remove(); 
        // console.log(catitem)
    }
})

function deletedata(e) {
    let a = $(e).closest('tr');
    let row = table.row(a).index();
    // console.log(row);
    catitem.splice(row,1);
    table.row(row).remove().draw(false);
    console.log(catitem)
}

function edit(e){
    let a = e.closest('tr');
    let row = table.row(a).index();
    upID = row;
    // console.log(row)
    let data = catitem[row].item;
    // console.log(data)
    let len = catitem[row].item.length;
    document.getElementById("categoryname").value = catitem[row].categoryname;
    document.getElementById("catdescription").value = catitem[row].catdescription;
    document.getElementById('launchdate').value = catitem[row].launchdate;

    for(let i = 0 ; i < len-1 ; i++){
        let row = 
                        `<tr class="">
                        <td scope="row"><input type="text" class="form-control"
                                name="itemname" id="itemname" aria-describedby="helpId"
                                placeholder="" required/>
                                <div class="invalid-feedback">Pease Enter Valida Name</div>
                            </td>
                        <td scope="row"><input type="text" class="form-control"
                                name="itemdescription" id="itemdescription"
                                aria-describedby="helpId" placeholder="" /></td>
                        <td scope="row">
                            <div class="mb-3">
                                <select class="form-select" name="foodtype" id="foodtype">
                                    <option>Dairy food</option>
                                    <option>Sea food</option>
                                    <option>Vegan</option>
                                    <option selected>Veg</option>
                                    <option>Nonveg</option>
                                </select>
                            </div>
                        </td>
                        <td scope="row"><input type="number" min="0" step="0.01" class="form-control" name="price" id="price" aria-describedby="helpId" placeholder="" required/> <div class="invalid-feedback">This field is required</div></td>
                        <td scope="row"><input type="number" min="0" max="15" step="0.01" class="form-control" name="discount" id="discount" aria-describedby="helpId" placeholder="" required/><div class="invalid-feedback">This field is required</div></td>
                        <td scope="row"><input type="number" min="0" step="0.01" class="form-control" name="gst" id="gst" aria-describedby="helpId" placeholder="" required/><div class="invalid-feedback">This field is required</div></td>
                        <td scope="row"><input class="form-check-input" type="checkbox" value="yes" id="active" checked /></td>
                        <td scope="row"><button type="button" class="btn btn-dark" onclick='deleterow(this)'>-</button></td>
                    </tr>
                    `
            document.getElementById('item').insertAdjacentHTML("beforeEnd",row);
    }   
    document.querySelectorAll('#item tr').forEach((element,index)=>{       
        Array.from(element.getElementsByTagName('input')).forEach((e)=>{
           e.value = data[index][e.id]   
        })  
        element.getElementsByTagName('select')[0].value = data[index]['foodtype'] ;
        
       
    })
    
}

$('#modalId').on('click',function(e) {
    if($(e.target).hasClass('modal')){
        $("#modalId").modal('hide');
        $("#form").trigger('reset');
        $("#item tr:gt(0)").remove();    
        form.classList.remove('was-validated');
        upID = null;
    }
})