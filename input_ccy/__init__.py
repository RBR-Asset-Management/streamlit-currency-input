import os
import streamlit.components.v1 as components

# Create a _RELEASE constant. We'll set this to False while we're developing
# the component, and True when we're ready to package and distribute it.
# (This is, of course, optional - there are innumerable ways to manage your
# release process.)
_RELEASE = True

# Declare a Streamlit component. `declare_component` returns a function
# that is used to create instances of the component. We're naming this
# function "_component_func", with an underscore prefix, because we don't want
# to expose it directly to users. Instead, we will create a custom wrapper
# function, below, that will serve as our component's public API.

# It's worth noting that this call to `declare_component` is the
# *only thing* you need to do to create the binding between Streamlit and
# your component frontend. Everything else we do in this file is simply a
# best practice.

if not _RELEASE:
    _component_func = components.declare_component(
        "input_ccy",
        url="http://localhost:3001",
    )
else:
    # When we're distributing a production version of the component, we'll
    # replace the `url` param with `path`, and point it to to the component's
    # build directory:
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(parent_dir, "frontend\\build")
    _component_func = components.declare_component("input_ccy", path=build_dir)


# Create a wrapper function for the component. This is an optional
# best practice - we could simply expose the component function returned by
# `declare_component` and call it done. The wrapper allows us to customize
# our component's API: we can pre-process its input args, post-process its
# output value, and add a docstring for users.
def input_ccy(name, label, locale, ccy, key=None):
    component_value = _component_func(
        name=name, label=label, locale=locale, ccy=ccy, key=key, default=None
    )

    # We could modify the value returned from the component if we wanted.
    # There's no need to do this in our simple example - but it's an option.
    return component_value


# Add some test code to play with the component while it's in development.
# During development, we can run this just as we would any other Streamlit
# app: `$ streamlit run my_component/__init__.py`
if not _RELEASE:
    import streamlit as st

    st.markdown("---")
    st.subheader("Component NO CCY | EN-US")

    amount = input_ccy(
        name="test2", label="Num EN", locale="en-US", ccy=False, key="foo1"
    )
    st.markdown(f"User input: {amount}")

    st.markdown("---")
    st.subheader("Component NO CCY | PT-BR")

    amount = input_ccy(
        name="test2", label="Num PT", locale="PT-BR", ccy=False, key="foo2"
    )
    st.markdown(f"User input: {amount}")

    st.markdown("---")
    st.subheader("Component CCY | EN-US")

    amount = input_ccy(name="test2", label="$ EN", locale="en-US", ccy=True, key="foo3")
    st.markdown(f"User input: {amount}")

    st.markdown("---")
    st.subheader("Component CCY | PT-BR")

    amount = input_ccy(name="test2", label="$ PT", locale="pt-BR", ccy=True, key="foo4")
    st.markdown(f"User input: {amount}")
