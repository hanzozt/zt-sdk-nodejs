update llhttp to 9.3.0 to avoid conflicts with nodejs runtime

llhttp@9.3.0 changes the layout of http parser 

this can be removed once https://github.com/microsoft/vcpkg/issues/49956 is fixed and released
