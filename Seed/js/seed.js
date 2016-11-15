$("#bar").hide();
$("#line").hide();

function ChangeDataType(selected)
{
    //alert(selected.value);
}

function ChangeDisplayType(selected)
{
    $("#table").hide();
    $("#bar").hide();
    $("#line").hide();
    if(selected.value == 'Table')
    {
        $("#table").show();
    }
    else if(selected.value == 'Bar Graph')
    {
        $("#bar").show();
    }
    else if(selected.value == 'Line Graph')
    {
        $("#line").show();
    }
}
