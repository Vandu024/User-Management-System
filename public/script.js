function confirmDelete(id)
{
    const confirmed =  confirm("Are you sure you want to delete this?");
    if(confirmed)
    {
        document.getElementById(`${id}`).submit();
    }
}

function updateUser()
{
    alert('Data Updated Successfully');
}