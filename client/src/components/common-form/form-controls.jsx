import { Label } from "@radix-ui/react-label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const FormControls = ({ formControls = [], formData, setFormData }) => {
  const renderComponentByComponentType = (getControlItem) => {
    let element = null;
    const value = formData[getControlItem.name] || '';

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <Input
            id={getControlItem.name}
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            type={getControlItem.type}
            value={value}
            onChange={(event) => setFormData({
              ...formData,
              [getControlItem.name]: event.target.value
            })}
          />
        );
        break;

      case "select":
        element = (
          <Select
            value={value}
            onValueChange={(selectedValue) => {
              console.log("Selected Value:", selectedValue); // Debugging
              setFormData({
                ...formData,
                [getControlItem.name]: selectedValue,
              });
            }}
          > 
            
            <SelectTrigger className="w-full border p-2 rounded bg-white text-black">
              <SelectValue placeholder={getControlItem.label || `Select ${getControlItem.label}`} />
              {value} 
            </SelectTrigger>
            <SelectContent 
              className="w-full bg-white shadow-md z-10 max-h-60 overflow-y-auto"
              position="popper" // Optional, for better positioning
            >
              {getControlItem.options && getControlItem.options.length > 0 ? (
                getControlItem.options.map(optionItem => (
                  <SelectItem
                    key={optionItem.id}
                    value={optionItem.id}
                    className="cursor-pointer p-2 hover:bg-gray-100"
                  >
                    {optionItem.label}
                  </SelectItem>
                ))
              ) : null}
            </SelectContent>
            
          </Select>
        );
        break;

      case "textarea":
        element = (
          <Textarea
            id={getControlItem.name}
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            value={value}
            onChange={(event) => setFormData({
              ...formData,
              [getControlItem.name]: event.target.value
            })}
          />
        );
        break;

      default:
        element = (
          <Input
            id={getControlItem.name}
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            value={value}
            onChange={(event) => setFormData({
              ...formData,
              [getControlItem.name]: event.target.value
            })}
          />
        );
        break;
    }

    return element;
  };

  return (
    <div className="flex flex-col gap-3">
      {formControls.map(controlItem => (
        <div key={controlItem.name} className="mb-4">
          <Label htmlFor={controlItem.name}>{controlItem.label}</Label>
          {renderComponentByComponentType(controlItem)}
        </div>
      ))}
    </div>
  );
};

export default FormControls;
