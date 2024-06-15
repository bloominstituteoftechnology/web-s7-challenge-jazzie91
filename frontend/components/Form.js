import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import axios from 'axios'

// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
}
 
export default function Form() {
  const {form, setForm} = useState({
    fullName: "",
    size: "",
    toppings: false
  })
  
  const {error, setError} = useState({
    fullName: "",
    size: "",
    toppings: "",
  })
  
const [ableToSubmit,setAbleToSubmit] = useState(false)

const [success, setSuccess] = useState("")
const [failure, setFailure] = useState(null)

  const validationSchema = Yup.object().shape({
    fullName: Yup.string()
    .trim()
    .min(3, validationErrors.fullNameTooShort)
    .max(20, validationErrors.fullNameTooShort)
    .required("Full name is required")
    size: Yup.string()
    .oneOf(['S','M','L'], validationErrors.sizeIncorrect)
    .required("Size is required"),
    toppings: Yup.array()
    .oneOf(['1','2','3','4','5'])
  })
  
  const toppings = [
    { topping_id: '1', text: 'Pepperoni' },
    { topping_id: '2', text: 'Green Peppers' },
    { topping_id: '3', text: 'Pineapple' },
    { topping_id: '4', text: 'Mushrooms' },
    { topping_id: '5', text: 'Ham' },
  ]

  const validationChange = (e) => {
    Yup
    .reach(validationSchema, e.target.fullName)
    .validate(
      e.target.type === "checkbox" ? e.target.checked :e.taget.value
    )
    .then(()=> {
      setError(error => ({ ...error, [e.target.name]: ''}))
    })
    .catch((error) => {
      setError(error => ({...error, [e.target.name]: errors.error[0]}))
    })
  }
  useEffect(() => {
    validationSchema.isValid(form).then((isFormValid) => {
      setAbleToSubmit(isFormValid)
    })  
  }, [form])
  
const handleChange = (e) => {
  e.presist(
    validateChange(e)
    setForm({
      ...form,
      [e.target.fullName]: 
      e.target.type === "checkbox" ? e.target.checked : e.target.value
    })
  )
}

const handleSubmit = (e) => {
  e.preventDefault()
  axios
  .post("http://localhost:9009/api/order", form)
  .then((res) => console.log("submitted", res))
}
  return (
    <><form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>
      {success && <div className='success'>(success)</div>}
      {failure && <div className='failure'>(failure)</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input placeholder="Type full name" 
            id="fullName" 
            type="text" 
            onChange={handleChange}
            name="fullNmae"
            value={form.fullName}
            />
            
        </div>
        {error.name &&  <div className='error'>(error.name)</div>}
      </div>

    <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select id="size">
            <option value="">----Choose Size----</option>
            {<><option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option></>}
          </select>
          {error.size && <div className='error'>{error.size}</div>}
        </div>
        </div>
        
      <div className="input-group">
        {/* 👇 Maybe you could generate the checkboxes dynamically */}
        {toppings.map((topping) => (
          <label key={topping.topping_id}>
            <input
              type="checkbox"
              name="toppings"
              value={topping.topping_id}
              checked={form.toppings.includes(topping.topping_id)}
              onChange={(e) => {
                const newToppings = e.target.checked
                  ? [...form.toppings, topping.topping_id]
                  : form.toppings.filter(id => id !== topping.topping_id)
                setForm({ ...form, toppings: newToppings })
              }}
            />
            {topping.text}
            </label>
        ))}
       </div>
      {/* 👇 Make sure the submit stays disabled until the form validates! */}
      <input type="submit" disabled={!ableToSubmit} />
    </form>
  )
}  

  
</>
