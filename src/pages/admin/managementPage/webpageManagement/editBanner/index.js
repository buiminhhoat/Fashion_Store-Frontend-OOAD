import React, {useEffect, useRef, useState} from "react";
import "./style.scss";
import {Carousel} from "react-responsive-carousel";

import defaultBanner from "./images/default-banner.png";
import {toast} from "react-toastify";
import BannerImageField from "./BannerImageField/BannerImageField";
import {useCookies} from "react-cookie";
import {TbArrowBigDownFilled, TbArrowBigUpFilled} from "react-icons/tb";
import ConfirmDialog from "@Components/dialogs/ConfirmDialog/ConfirmDialog";
import {API, BANNER, BREADCRUMB, CONFIRM_DIALOG, EDIT_BANNER_PAGE, MESSAGE} from "@Const";

const defaultBannerImages = [
  { defaultImage: defaultBanner },
  { defaultImage: defaultBanner },
  { defaultImage: defaultBanner },
];

const bannersData = [
  {
    "bannerID": 5,
    "displayOrder": 0,
    "imagePath": "https://iili.io/JRDfz1R.webp",
    "bannerLinkTo": "/"
  },
  {
    "bannerID": 6,
    "displayOrder": 1,
    "imagePath": "https://iili.io/JRDfIgp.webp",
    "bannerLinkTo": "/"
  },
  {
    "bannerID": 7,
    "displayOrder": 2,
    "imagePath": "https://iili.io/JRDfudN.webp",
    "bannerLinkTo": "/"
  },
  {
    "bannerID": 8,
    "displayOrder": 3,
    "imagePath": "https://iili.io/JRDfA7I.webp",
    "bannerLinkTo": "/"
  }
];

const EditBannerPage = () => {
  const [cookies] = useCookies(['access_token']);
  const accessToken = cookies.access_token;

  const inputRef = useRef(null);
  const [isShowConfirmDialog, setIsShowConfirmDialog] = useState(false);

  const [banners, setBanners] = useState([]);

  async function fetchImageAsFile(imageUrl, imageName) {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new File([blob], imageName, {type: blob.type});
  }

  const initData = async () => {
    const fetchImagePromises = bannersData.map(imageData => {
      const imageUrl = imageData.imagePath;
      return fetchImageAsFile(imageUrl, imageData.imagePath);
    });

    Promise.all(fetchImagePromises)
        .then(files => {
          let newBanners = [];
          for (let i = 0; i < bannersData.length; ++i) {
            newBanners.push({
              imageFile: files[i],
              imageURL: URL.createObjectURL(files[i]),
              bannerLinkTo:bannersData[i].bannerLinkTo
            });
          }
          setBanners(newBanners);
        })
        .catch(error => {
          console.error(error);
        });
  }

  useEffect(() => {
    initData().then(r => {});
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files.length === 0) return;
    const files = e.target.files;
    if (files) {
      let newBanners = [...banners];
      for (let i = 0; i < files.length; ++i) {
        if (newBanners.length === BANNER.MAX_BANNER_IMAGES) {
          toast.warn(MESSAGE.MAXIMUM_UPLOAD_LIMIT_BANNER);
          break;
        }
        newBanners.push({imageFile: files[i], imageURL: URL.createObjectURL(files[i]), bannerLinkTo:""});
      }
      setBanners(newBanners);
    }
    inputRef.current.value = null;
  };

  return (
      <div id="app">
        <main id="main">
          <div className="container profile-wrap">
            <div className="breadcrumb-wrap">
              <a href="/">{BREADCRUMB.HOME_PAGE}</a>
              &gt; <span>{BREADCRUMB.SHOP_MANAGEMENT}</span>
              &gt; <span>{BREADCRUMB.EDIT_BANNER}</span>
            </div>
          </div>

          <div className="container pe-0 ps-0" style={{marginTop: "10px"}}>
            <div data-v-03749d40="" className="product-edit__container">
              <div data-v-03749d40="" className="product-edit">
                <section data-v-03749d40="" className="product-edit__section">
                  <div data-v-2250a4e1="" data-v-54a51dd8="" data-v-03749d40="" style={{padding:"40px 80px 70px 90px"}}
                       className="product-detail-panel product-basic-info" >

                    <div style={{color: "#bd0000", fontSize: "23px", fontWeight: "700", lineHeight: "25px", margin: "10px 0 40px 0"}}>
                      <div data-v-2250a4e1="" className="header__wrap">
                        <div data-v-54a51dd8="" data-v-2250a4e1="" className="title">
                          {EDIT_BANNER_PAGE.BANNER_TITLE}
                        </div>
                      </div>
                    </div>

                    <div style={{display:"flex", justifyContent:"center", width:"100%"}}>
                      { banners && banners.length > 0 ?
                        <div key={banners.length} style={{width:"900px", border:"1px solid #E5E5E5"}}>
                          <Carousel
                              autoPlay
                              infiniteLoop
                              showStatus={false}
                              showThumbs={false}
                          >
                            { banners.map((banner, index) => (
                              <div key={index}>
                                <img src={banner.imageURL} alt={`banner ${index + 1}`}
                                     style={{ width: "900px", height: "384px", objectFit: "contain", backgroundColor:"#fff"}} />
                              </div>
                            ))}
                          </Carousel>
                        </div>
                        :
                        <div key={0} style={{width:"900px", border:"1px solid #E5E5E5"}}>
                          <Carousel
                              autoPlay
                              infiniteLoop
                              showStatus={false}
                              showThumbs={false}
                          >
                            { defaultBannerImages.map((banner, index) => (
                              <div key={index}>
                                <img src={banner.defaultImage} alt={`banner ${index + 1}`} />
                              </div>
                            ))}
                          </Carousel>
                        </div>
                      }

                    </div>

                    <div style={{margin:"50px 0 30px"}}>
                      <span style={{fontSize: "17px", fontWeight: "500", lineHeight: "22px"}}>{EDIT_BANNER_PAGE.UPLOAD_IMAGE}</span>
                      <li>{EDIT_BANNER_PAGE.IMAGE_SIZE}</li>
                      <li>{EDIT_BANNER_PAGE.MAX_IMAGE_SIZE}</li>
                      <li>{EDIT_BANNER_PAGE.IMAGE_FORMAT}</li>
                    </div>

                    <div style={{margin:"0 0 25px"}} className="popover-wrap">
                      <button
                          onClick={() => {inputRef.current.click()}}
                          type="button"
                          className="primary-dash-button fashion-store-button fashion-store-button--primary fashion-store-button--large fashion-store-button--outline"
                          data-education-trigger-key="variations">
                        <i className="fashion-store-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M8.48176704,1.5 C8.75790942,1.5 8.98176704,1.72385763 8.98176704,2 L8.981,7.997 L15 7.99797574 C15.2761424,7.99797574 15.5,8.22183336 15.5,8.49797574 C15.5,8.77411811 15.2761424,8.99797574 15,8.99797574 L8.981,8.997 L8.98176704,15 C8.98176704,15.2761424 8.75790942,15.5 8.48176704,15.5 C8.20562467,15.5 7.98176704,15.2761424 7.98176704,15 L7.981,8.997 L2 8.99797574 C1.72385763,8.99797574 1.5,8.77411811 1.5,8.49797574 C1.5,8.22183336 1.72385763,7.99797574 2,7.99797574 L7.981,7.997 L7.98176704,2 C7.98176704,1.72385763 8.20562467,1.5 8.48176704,1.5 Z"></path>
                          </svg>
                        </i>
                        <span> {EDIT_BANNER_PAGE.UPLOAD_IMAGE_LABEL} ({banners.length}/{BANNER.MAX_BANNER_IMAGES})</span>
                      </button>
                      <input
                          type="file"
                          ref={inputRef}
                          accept="image/*"
                          multiple="multiple"
                          style={{ display: 'none' }}
                          onChange={(e) => handleFileChange(e)}
                      />
                    </div>

                    {banners.map((banner, index) => (
                        <div key={index} style={{display:"flex"}}>
                          <div key={index} data-v-389929d8="" className="edit-row-right-full variation-edit-item"
                               style={{margin:"0 5px 20px 0", width:"40px", maxWidth:"40px", display:"flex", justifyContent:"center", alignItems:"center"}}
                          >
                            <div style={{margin:"0 0 0 0", width:"20px", height:"100%", display:"flex", flexDirection: "column", justifyContent: "space-around",}}>
                              <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                                <TbArrowBigUpFilled
                                    style={{color:`${index?"#999999":"D8D8D8"}`, cursor:`${index?"pointer":"not-allowed"}`, fontSize:"20px"}}
                                    onClick={() => {
                                      if (!index) return;
                                      let newBanners = [...banners];
                                      [newBanners[index], newBanners[index - 1]] = [newBanners[index - 1], newBanners[index]];
                                      setBanners(newBanners);
                                    }}
                                />
                              </div>
                              <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                                <TbArrowBigDownFilled
                                    style={{color:`${index!==banners.length-1?"#999999":"D8D8D8"}`, cursor:`${index!==banners.length-1?"pointer":"not-allowed"}`, fontSize:"20px"}}
                                    onClick={() => {
                                      if (index===banners.length-1) return;
                                      let newBanners = [...banners];
                                      [newBanners[index], newBanners[index + 1]] = [newBanners[index + 1], newBanners[index]];
                                      setBanners(newBanners);
                                    }}
                                />
                              </div>
                            </div>
                          </div>
                          <BannerImageField index = {index} banners={banners} setBanners={setBanners}/>
                        </div>
                    ))}

                  </div>
                </section>
              </div>
            </div>

            <div data-v-03749d40="" className="product-edit__container">
              <div data-v-03749d40="" className="product-edit">
                <section style={{ marginBottom:"50px" }}>
                  <div className="button-container">
                    <button type="button" className="product-details-btn">
                      {EDIT_BANNER_PAGE.SAVE_BTN}
                    </button>
                    <button type="button" className="product-details-btn product-details-btn-danger"
                            onClick={() => {setIsShowConfirmDialog(true)}}
                    >
                      {EDIT_BANNER_PAGE.RESTORE_BTN}
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </div>

        </main>

        {isShowConfirmDialog && (
            <div className="modal-overlay">
              <ConfirmDialog title={<span style={{color:"#bd0000"}}>{CONFIRM_DIALOG.WARNING_TITLE}</span>}
                             subTitle={
                               <>
                                 {CONFIRM_DIALOG.CONFIRM_RESTORE_DATA}
                               </>
                             }
                             titleBtnAccept={CONFIRM_DIALOG.TITLE_BTN_ACCEPT}
                             titleBtnCancel={CONFIRM_DIALOG.TITLE_BTN_CANCEL}
                             onAccept={() => {
                               initData().then(r => {setIsShowConfirmDialog(false)})
                             }}
                             onCancel={() => {setIsShowConfirmDialog(false)}}/>
            </div>
        )}
      </div>
  );
}

export default EditBannerPage;