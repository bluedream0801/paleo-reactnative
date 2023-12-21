const confirmFinalAddress = async () => {
  // Add loading animation ?
  var errors = ''

  var mobile_number = mobileNumber
  mobile_number = mobile_number.replace(/\s+/g, '')

  if (mobile_number.replace(/[^0-9\s]/, '').length != 10) {
    setMobileNumberError(
      'We found an issue with your mobile number. It should start with a zero and have 10 digits.',
    )
    return
  }

  if (false) {
  } else {
    // No errors

    let stateString = state
    // Manipulation for the Province Name
    if (stateString == 'Krung Thep Maha Nakhon') {
      stateString = 'Bangkok'
    }

    var areaString = area
    // Manipulation for the District Name
    if (areaString === undefined) {
      areaString = ''
    }
    var area_with_no_khet = areaString.replace('Khet ', '')

    var cityString = city
    var google_sublocality_level_String = google_sublocality_level_2
    // Manipulation for the Subdistrict Name
    if (
      cityString === undefined &&
      google_sublocality_level_String === undefined
    ) {
      // Do nothing in this scenario
    } else {
      var subdistrict_name = cityString
      // Depends on where we get this from
      if (cityString === undefined) {
        subdistrict_name = google_sublocality_level_String
      }
      var subdistrict_name_with_no_khwaeng = subdistrict_name.replace(
        'Khwaeng ',
        '',
      )
    }

    // Retrieving the ids from the database for later population
    var vals = {
      province: stateString,
      district: area_with_no_khet,
      subdistrict: subdistrict_name_with_no_khwaeng,
    }

    var province_id = null
    var district_id = null
    var subdistrict_id = null

    await API.execute(
      'address',
      'search_address',
      [vals],
      {},
      setIsApiLoaderShowing,
      { token: token, user_id: user_id },
    ).then((data) => {
      console.log('Mixed search result', data)
      province_id = data.province_id
      district_id = data.district_id
      subdistrict_id = data.subdistrict_id
    })

    var final_address_name = ''
    if (building != '') {
      final_address_name = building + ', ' + soi + ', ' + houseNumber
    } else {
      final_address_name = soi + ', ' + houseNumber
    }

    var vals = {
      // address: this.state.address_autocomplete, // THIS IS USED AS NAME IN THE LISTINGS
      address: final_address_name, // THIS IS USED AS NAME IN THE LISTINGS

      address2: address,
      postal_code: postal_code,
      soi: soi,
      coords: lat + ',' + lng, // From retrieved data

      province_id: province_id, // Retrieved from Netforce
      district_id: district_id, // Retrieved from Netforce
      subdistrict_id: subdistrict_id, // Retrieved from Netforce

      bldg_name: building,
      mobile: mobile_number,
      instructions_messenger: specialInstruction,
      unit_no: houseNumber,

      state: 'confirmed',
    }

    // If the user is logged in we do this straight away // OTHERWISE WE NEED TO SAVE THE ADDRESS TO HIS ACCOUNT WHEN HE LOGS IN OR CREATES A NEW ACCOUNT

    vals.contact_id = id

    console.log('vals--', vals)

    var current_address_id = 0

    if (isEdit) {
      await API.execute(
        'address',
        'write',
        [[addressObj.id], vals],
        {},
        setIsApiLoaderShowing,
        {
          token: token,
          user_id: user_id,
        },
      )
        .then((res) => {
          console.log('Newly Added Address ID', res)
          current_address_id = res
        })
        .catch((err) => {
          alert(err)
        })
    } else {
      await API.execute(
        'address',
        'create',
        [vals],
        {},
        setIsApiLoaderShowing,
        {
          token: token,
          user_id: user_id,
        },
      )
        .then((res) => {
          console.log('Newly Added Address ID', res)
          current_address_id = res
        })
        .catch((err) => {
          alert(err)
        })
    }

    await API.execute(
      'address',
      'set_zone',
      [[current_address_id]],
      {},
      setIsApiLoaderShowing,
      { token: token, user_id: user_id },
    )
      .then((res) => {
        console.log('Newly Added Zone for address', res)
        if (isEdit) {
          alert('Address updated')
        } else {
          alert('Address addedd')
          navigation.goBack()
          navigation.goBack()
        }

        navigation.goBack()
      })
      .catch((err) => {
        alert(err)
      })
  }
}
