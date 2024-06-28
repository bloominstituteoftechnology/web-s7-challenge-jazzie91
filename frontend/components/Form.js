import React, { useEffect, useState } from 'react'
import axios from 'axios'
import * as yup from 'yup'

// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
}

// 👇 Here you will create your schema.
const formSchema = yup.object().shape({
  fullName: yup.string()
    .min(3, validationErrors.fullNameTooShort)
    .max(20, validationErrors.fullNameTooLong)
    .trim(),
  size: yup.string()
    .oneOf(['S', 'M', 'L'], validationErrors.sizeIncorrect),
})

// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
]

const initialValues = { fullName: '', size: '', toppings: [] }

export default function Form() {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({ fullName: '', size: '' })
  const [submitEnabled, setSubmitEnabled] = useState(false)
  const [serverSuccess, setServerSuccess] = useState('')
  const [serverFailure, setServerFailure] = useState('')

  useEffect(() => {
    formSchema.isValid(values).then((isValid) => {
      setSubmitEnabled(isValid)
    })
  }, [values.fullName, values.size])

  const validate = (key, value) => {
    yup
      .reach(formSchema, key)
      .validate(value)
      .then(() => { setErrors({ ...errors, [key]: "" }) })
      .catch((error) => { setErrors({ ...errors, [key]: error.errors[0] }) })
  }

  const changeValue = evt => {
    const { id, value } = evt.target
    validate(id, value)
    setValues({ ...values, [id]: value })
  }

  const changeTopping = evt => {
    const { name, checked } = evt.target
    if (checked) setValues({ ...values, toppings: [...values.toppings, name] })
    else setValues({ ...values, toppings: values.toppings.filter(t => t != name) })
  }

  const onSubmit = evt => {
    evt.preventDefault()
    axios.post('http://localhost:9009/api/order', values)
      .then(res => {
        setServerSuccess(res.data.message)
        setServerFailure('')
        setValues(initialValues)
      })
      .catch(err => {
        setServerSuccess('')
        setServerFailure(err?.response?.data?.message)
      })
  }
  return (
    <form onSubmit={onSubmit}>
      <h2>Order Your Pizza</h2>
      {serverSuccess && <div className='success'>{serverSuccess}</div>}
      {serverFailure && <div className='failure'>{serverFailure}</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input placeholder="Type full name" id="fullName" type="text" value={values.fullName} onChange={changeValue} />
        </div>
        {errors.fullName && <div className='error'>{errors.fullName}</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select id="size" value={values.size} onChange={changeValue}>
            <option value="">----Choose Size----</option>
            {/* Fill out the missing options */}
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
        </div>
        {errors.size && <div className='error'>{errors.size}</div>}
      </div>

      <div className="input-group">
        {/* 👇 Maybe you could generate the checkboxes dynamically */}
        {
          toppings.map(({ topping_id, text }) => (
            <label key={topping_id}>
              <input
                name={topping_id}
                type="checkbox"
                onChange={changeTopping}
                checked={!!values.toppings.find(t => t == topping_id)}
              />
              {text}<br />
            </label>
          ))
        }
      </div>
      {/* 👇 Make sure the submit stays disabled until the form validates! */}
      <input disabled={!submitEnabled} type="submit" />
    </form>
  )
}