import React from "react"

import {Input, InputCheckbox, InputSubmit} from "../form/Inputs"
import {reactElementProps} from "../../test/integration"
import ErrorNotice from "../ErrorNotice"
import Brand from "./Brand"
import EmptyCheck from "../EmptyCheck"
import Form from "../form/Form"
import LoginWelcome from "./LoginWelcome"
import SavedClusters from "./SavedClusters"
import useLoginController from "./useLoginController"

export default function LoginPage() {
  const login = useLoginController()

  return (
    <div className="login">
      <aside>
        <Brand />
        <EmptyCheck array={login.saved} empty={<LoginWelcome />}>
          <SavedClusters
            onClick={login.submitSaved}
            onRightClick={login.showSavedMenu}
            saved={login.saved}
          />
        </EmptyCheck>
      </aside>
      <main>
        <div className="login-form" {...reactElementProps("login")}>
          <h3 className="section-heading">New Connection</h3>
          <Form onSubmit={login.submitForm}>
            <Input
              label="Host:"
              name="host"
              type="text"
              required
              autoFocus
              value={login.form.host}
              onChange={login.onFormChange}
            />
            <Input
              label="Username:"
              name="username"
              type="text"
              value={login.form.username}
              onChange={login.onFormChange}
            />
            <Input
              label="Password:"
              name="password"
              type="password"
              value={login.form.password}
              onChange={login.onFormChange}
            />
            <InputCheckbox
              label="Save credentials"
              name="save"
              checked={login.form.save}
              onChange={login.onFormChange}
            />
            <InputSubmit value="Connect" />
          </Form>
          <ErrorNotice />
        </div>
      </main>
    </div>
  )
}
