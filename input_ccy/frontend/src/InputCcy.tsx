import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib"
import React, { ReactNode } from "react"

interface State {
  amount: string
  amount_n: number | null
  isFocused: boolean
  locale: string
  ccy: boolean
  locale_regex: RegExp;
  locale_decimal: string;
}

/**
 * This is a React-based component template. The `render()` function is called
 * automatically when your component should be re-rendered.
 */
class InputCcy extends StreamlitComponentBase<State> {
  public state = { amount: "", amount_n: null, isFocused: false, locale: "pt-BR", ccy: false, locale_regex: /[R$.]/g, locale_decimal: ",", }

  public render = (): ReactNode => {
    // Arguments that are passed to the plugin in Python are accessible
    // via `this.props.args`. Here, we access the "name" arg.
    const name = this.props.args["name"]
    const label = this.props.args["label"]



    // Streamlit sends us a theme object via props that we can use to ensure
    // that our component has visuals that match the active theme in a
    // streamlit app.
    const { theme } = this.props
    const style: React.CSSProperties = {}

    // Maintain compatibility with older versions of Streamlit that don't send
    // a theme object.
    if (theme) {
      // Use the theme object to style our button border. Alternatively, the
      // theme style is defined in CSS vars.

    }

    // Show a button and some text.
    // When the button is clicked, we'll increment our "numClicks" state
    // variable, and send its new value back to Streamlit, where it'll
    // be available to the Python program.
    return (
      <span className="input-group-text">
        {label} &nbsp;
        <input type="text" name={name}
          style={style}
          className="form-control"
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          onChange={this.onChange}
          value={this.state.amount}
          disabled={this.props.disabled}
        >
        </input>
      </span>
    )
  }

  private onBlur = (): void => {

    const locale_input = this.props.args["locale"]
    const ccy = this.props.args["ccy"]

    var locale_ccy = "BRL"

    if (locale_input === "en-US") {
      this.state.locale = locale_input
      this.state.ccy = ccy

      this.state.locale_regex = /[$,]/g
      this.state.locale_decimal = "."

      locale_ccy = "USD"
    }


    let value = this.state.amount;
    // Regular expression to only allow numbers, the letters k, m, b, comma, and dollar sign.
    const pattern = /^[0-9kmbKMB,.$]*$/i;

    // If the value doesn't match the pattern, return without updating state.
    if (!pattern.test(value)) {
      return;
    }

    if (value.endsWith('k')) {
      value = (parseFloat(value) * 1000).toString();
    } else if (value.endsWith('m')) {
      console.log(value)
      value = (parseFloat(value) * 1000000).toString();
    } else if (value.endsWith('b')) {
      value = (parseFloat(value) * 1000000000).toString();
    } else if (value.endsWith('K')) {
      value = (parseFloat(value) * 1000).toString();
    } else if (value.endsWith('M')) {
      console.log(value)
      value = (parseFloat(value) * 1000000).toString();
    } else if (value.endsWith('B')) {
      value = (parseFloat(value) * 1000000000).toString();
    }
    this.setState({ amount: value, isFocused: false },
      // TO-DO melhorar
      () => Streamlit.setComponentValue(this.state.amount_n)
    );

    var formatter
    if (ccy === true) {
      formatter = new Intl.NumberFormat(this.state.locale, {
        style: 'currency',
        currency: locale_ccy,
      });
    } else {
      formatter = new Intl.NumberFormat(this.state.locale, { minimumFractionDigits: 3 });
    }

    var amount_formated
    if (value === "") {
      amount_formated = ""
    } else {
      amount_formated = formatter.format(parseFloat(value.replace(this.state.locale_regex, '').replace(this.state.locale_decimal, '.')))
    }

    var amount_value
    if (value === "") {
      amount_value = null
    } else {
      amount_value = parseFloat(value.replace(this.state.locale_regex, '').replace(this.state.locale_decimal, '.'))
    }

    this.setState({ amount: amount_formated, amount_n: amount_value, isFocused: false },
      () => Streamlit.setComponentValue(this.state.amount_n)
    );

  }

  private onFocus = (): void => {

    var locale_ccy
    if (this.state.locale === 'en-US') {
      locale_ccy = 'USD'
    } else {
      locale_ccy = 'BRL'
    }

    var formatter_foco
    if (this.state.ccy === true) {
      formatter_foco = new Intl.NumberFormat(this.state.locale, {
        style: 'currency',
        currency: locale_ccy,
        minimumFractionDigits: 10
      });
    } else {
      formatter_foco = new Intl.NumberFormat(this.state.locale, { minimumFractionDigits: 10 });
    }

    var formattedValue
    if ((this.state.amount_n === 0) || (this.state.amount_n === null)) {
      formattedValue = ""
    } else {
      formattedValue = formatter_foco.format(this.state.amount_n);
    }
    this.setState({ amount: formattedValue, isFocused: true });
  }

  private onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ amount: e.target.value },
      () => Streamlit.setComponentValue(this.state.amount_n)
    );
  }


};


// "withStreamlitConnection" is a wrapper function. It bootstraps the
// connection between your component and the Streamlit app, and handles
// passing arguments from Python -> Component.
//
// You don't need to edit withStreamlitConnection (but you're welcome to!).
export default withStreamlitConnection(InputCcy)
