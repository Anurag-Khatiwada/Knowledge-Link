import React from 'react'
import { Button } from '../ui/button'
import FormControls from './form-controls';

const CommonForm = ({
    handleSubmit, 
    buttonText, 
    formControls = [], 
    formData, 
    setFormData,
    isButtonDisabled=false
}) => {
  return (
    <form onSubmit={handleSubmit}>
        {/* render from components */}
        <FormControls formControls={formControls} formData={formData} setFormData={setFormData}/>
        <Button disable={isButtonDisabled} type="submit" className="mt-5 w-full">{buttonText || "Submit"}</Button>
    </form>
)}

export default CommonForm;