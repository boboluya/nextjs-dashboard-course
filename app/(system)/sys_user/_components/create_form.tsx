"use client";
import {
  Field,
  FieldTitle,
  FieldGroup,
  FieldLabel,
  FieldSet
} from "@/components/ui/filed";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { useActionState, useState } from "react";
import { State } from "../_lib/actions";
import { createSysUser } from "../_lib/actions";
import { Button } from "@/components/ui/button";

export function CreateForm(data: {
  sexDict: Record<string, string>[]
}) {
  const sexDicts = [
    { dictValue: "1", dictLabel: "Male" },
    { dictValue: "2", dictLabel: "Female" },
  ]
  const [sexValue, setSexValue] = useState("");
  const initialState: State = { errors: {}, message: null }
  const [state, formAction, isPending] = useActionState(createSysUser, initialState)
  return (
    <div className="m-3 bg-gray-100 rounded-lg p-3" >
      <form className="[&_Input]:border-2" action={formAction}>
        <FieldSet className="w-full">
          <FieldTitle className="text-lg">Create</FieldTitle>
          <FieldGroup className="grid grid-cols-2 gap-4">
            <Field orientation="vertical">
              <FieldLabel htmlFor="userName-field" className="w-1/6">Account</FieldLabel>
              <Input id="userName-field" name="userName" placeholder="Account"></Input>
              <div id="userName-error" aria-live="polite" aria-atomic="true">
                {state.errors?.userName &&
                  state.errors.userName.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </Field>
            <Field orientation="vertical">
              <FieldLabel htmlFor="Name-field" className="w-1/6">Name</FieldLabel>
              <Input id="nickName-field" name="nickName" placeholder="Name"></Input>
              <div id="nickName-error" aria-live="polite" aria-atomic="true">
                {state.errors?.nickName &&
                  state.errors.nickName.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </Field>
            <Field orientation="vertical">
              <FieldLabel htmlFor="password-field" className="w-1/6">Password</FieldLabel>
              <Input id="password-field" name="password" type="password" placeholder="Password"></Input>
              <div id="password-error" aria-live="polite" aria-atomic="true">
                {state.errors?.password &&
                  state.errors.password.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </Field>
            <Field orientation="vertical">
              <FieldLabel htmlFor="email-field" className="w-1/6">Email</FieldLabel>
              <Input id="email-field" name="email" type="email" placeholder="Email"></Input>
              <div id="email-error" aria-live="polite" aria-atomic="true">
                {state.errors?.email &&
                  state.errors.email.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </Field>
            <Field orientation="vertical">
              <FieldLabel htmlFor="phonenubmer-field" className="w-1/6">Phone</FieldLabel>
              <Input id="phonenumber-field" name="phonenumber" type="number" placeholder="Phone"></Input>
            </Field>
            <Field orientation="vertical">
              <FieldLabel htmlFor="sex-field" className="w-1/6">Sex</FieldLabel>
              <Select value={sexValue} onValueChange={setSexValue}>
                <input type="hidden" name="sex" value={sexValue} />
                <SelectTrigger id="sex-field" className="border-2">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={4} className="bg-white shadow-lg">
                  <SelectGroup>
                    {sexDicts.map((dict) => {
                      return (<SelectItem value={dict.dictValue} key={dict.dictValue}>
                        {dict.dictLabel}
                      </SelectItem>)
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <div id="sex-error" aria-live="polite" aria-atomic="true">
                {state.errors?.sex &&
                  state.errors.sex.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </Field>
          </FieldGroup>
        </FieldSet>
        <Button type="submit">submit</Button>
      </form>
    </div>
  );
}
