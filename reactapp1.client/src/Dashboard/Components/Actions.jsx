import Button from 'react-bootstrap/Button';

function Actions() {     
                      
    return (
        <>
        <span className="me-2">
        <Button variant="warning">Edit</Button>
        </span>
        <span>
        <Button variant="danger">Delete</Button>
        </span>
        </>
    )

}
export default Actions;