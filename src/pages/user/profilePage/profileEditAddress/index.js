import React, {useEffect, useState} from "react";
import './style.scss';

import {useCookies} from "react-cookie";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";

import {toast} from "react-toastify";
import arrowLeft1 from '../images/arrow_left_1.svg'
import queryString from "query-string";
import {API, MESSAGE, PROFILE_PAGE} from "@Const";

const ProfileEditAddress = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const [userID, setUserID] = useState(queryParams.userID);
  const [addressID, setAddressID] = useState(queryParams.addressID);

  const [cookies] = useCookies(['access_token']);
  const [address, setAddress] = useState({});
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [addressDetails, setAddressDetails] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const accessToken = cookies.access_token;

  const addressData = [
    {
      "addressID": 5,
      "usersID": 4,
      "recipientName": "Bùi Minh Hoạt",
      "recipientPhone": "0912345678",
      "addressDetails": "144 Xuân Thuỷ, Cầu Giấy, Hà Nội",
      "isDefault": true
    },
    {
      "addressID": 6,
      "usersID": 4,
      "recipientName": "Nguyễn Châu Khanh",
      "recipientPhone": "0999999999",
      "addressDetails": "Hà Nội",
      "isDefault": false
    }
  ];

  const getData = () => {
    const data  = (addressID == 5 ? addressData[0] : addressData[1]);
    setAddress(data);
    setRecipientName(data.recipientName);
    setRecipientPhone(data.recipientPhone);
    setAddressDetails(data.addressDetails);
  }

  useEffect(() => {
    getData();
  }, []);

  const handleCancel = () => {
    navigate(`/profile/address?userID=4`);
  }

  return (
      <div className="col-8 content-children item-row">
        <section className="new__address__wrap" style={{minHeight: "438px"}}>
          <section className="header__wrap">
            <button className="btn__back">
              <Link to={`/profile/address?userID=4`}>
                <img src={arrowLeft1} alt="icon arrow left" />
              </Link>
            </button>
            <span className="title">{PROFILE_PAGE.PROFILE_EDIT_ADDRESS.UPDATE_ADDRESS}</span>
          </section>

          <form id="add-new-address" action="" method="POST">
            <input type="hidden" name="_token" value="3b5uU0DbQ1xoXiDiljwxaFX7Pa9usSichthgGiHt" />
            <section className="content__wrap">
              <article className="information__wrap" style={{marginLeft: "20px"}}>
                <div className="info__item">
                  <label className="form-label">{PROFILE_PAGE.PROFILE_EDIT_ADDRESS.FULL_NAME}</label>
                  <input type="text" className="form-control"
                         id="name" placeholder={PROFILE_PAGE.PROFILE_EDIT_ADDRESS.FULL_NAME_PLACEHOLDER} name="name"
                         onChange={(e) => setRecipientName(e.target.value)}
                         defaultValue={address.recipientName}
                  />
                  <span className="error" id="errorName" />
                </div>
                <div className="info__item">
                  <label className="form-label">{PROFILE_PAGE.PROFILE_EDIT_ADDRESS.PHONE_NUMBER}</label>
                  <input type="text" className="form-control" id="phone"
                         placeholder={PROFILE_PAGE.PROFILE_EDIT_ADDRESS.PHONE_NUMBER_PLACEHOLDER} name="phone"
                         onChange={(e) => setRecipientPhone(e.target.value)}
                         defaultValue={address.recipientPhone}
                  />
                  <span className="error" id="errorPhone" />
                </div>
                <div className="info__item">
                  <label className="form-label">{PROFILE_PAGE.PROFILE_EDIT_ADDRESS.ADDRESS}</label>
                  <input type="text" className="form-control" id="address"
                         placeholder={PROFILE_PAGE.PROFILE_EDIT_ADDRESS.ADDRESS_PLACEHOLDER} name="address"
                         onChange={(e) => setAddressDetails(e.target.value)}
                         defaultValue={address.addressDetails}
                  />
                  <span className="error" id="errorAddress" />
                </div>

              </article>
            </section>

            <section className="footer__wrap" style={{marginLeft: "30px"}}>
              <button type="button" className="btn btn-danger" id="save">
                {PROFILE_PAGE.PROFILE_EDIT_ADDRESS.SAVE_CHANGES}
              </button>
              <button type="button" className="btn btn-outline-danger" id="cancel" onClick={handleCancel}>
                {PROFILE_PAGE.PROFILE_EDIT_ADDRESS.CANCEL}
              </button>
            </section>
          </form>
        </section>
      </div>
  );
}

export default ProfileEditAddress;