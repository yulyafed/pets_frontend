import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getIsLoggedIn, getUserById } from '../../../redux/Auth/selectors';
import { Modal } from 'components/Modal/Modal';
import { NoticeModal } from 'components/Notices/NoticeModal/NoticeModal';
import { FavoriteBtn } from 'components/ButtonFavorite/BtnFavorite';
import { changeFavoritesNotices } from '../../../redux/Notices/NoticesSlice';
import { selectFavoriteNotices } from '../../../redux/Auth/selectors';
import {
  updateFavoriteNotice /*, getFavoriteNotices */,
} from '../../../redux/Auth/operations';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

import {
  ListItem,
  ImgWrap,
  Category,
  Title,
  Img,
  ListInfo,
  LiInfo,
  Lable,
  Text,
  Wrap,
  ThumbBtn,
} from './NoticeCategoryItem.styled';

import { NoticeBtn } from 'components/ButtonNotice/BtnNotice';

export const NoticeCategoryItem = ({ data, route }) => {
  // console.log('notices in Item', data);
  const {
    _id,
    title,
    category,
    name,
    birthdate,
    breed,
    location,

    imgURL,
    price,
  } = data;

  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  // const [isShownConfirmationDelete, setIsShownConfirmationDelete] =
  //   useState(false);

  const isAuth = useSelector(getIsLoggedIn);

  const currentUser = useSelector(getUserById);

  const favorites = useSelector(selectFavoriteNotices);
  // const getFavoriteArray = getFavoriteNotices({ userId: currentUser });
  // const favorites = useSelector(getFavoriteArray);
  // console.log('favorites in Item---->', favorites);
  // console.log('_id---->', _id);
  const isFavorite = favorites.includes(_id);
  // console.log('isFavorite in Item---->', isFavorite);

  const toggleModal = () => {
    setShowModal(prevState => !prevState);
  };

  const onChangeFavorite = () => {
    // console.log('Isfavorite', isFavorite);
    if (isAuth) {
      dispatch(
        updateFavoriteNotice({
          // userId: '63f21c7c7b3475992d694d48',
          userId: currentUser,
          noticeId: _id,
        })
      );
      // console.log('favorite change', favorite);
      toast.success('favorite change  success');

      if (route === 'favorite') {
        dispatch(changeFavoritesNotices(_id));
      }
    } else {
      toast.error(`You must be authorized to use this functionality!.`);

      return;
    }
  };

  const getTitleCategory = category => {
    let result = 'sell';
    switch (category) {
      case 'lost_found':
        result = 'lost/found';
        break;
      case 'for_free':
        result = 'in good hands';
        break;
      case 'favorite':
        result = 'favorite ads';
        break;
      case 'own':
        result = 'my ads';
        break;
      default:
        break;
    }
    return result;
  };

  const onOpenModal = () => {
    setShowModal(true);
  };

  const parseDate = time => {
    return new Date(Date.parse(time)).toLocaleDateString();
  };

  return (
    <ListItem>
      <ImgWrap>
        <Category>{getTitleCategory(category)}</Category>
        <Img src={imgURL} alt={name} />

        <FavoriteBtn
          favorite={isFavorite}
          // favorite={favorite}
          onClick={onChangeFavorite}
        />
      </ImgWrap>
      <Wrap>
        <Title>{title}</Title>
        <ListInfo>
          <LiInfo key={`${_id}+breed`}>
            <Lable>Breed:</Lable>
            <Text>{breed}</Text>
          </LiInfo>
          <LiInfo key={`${_id}+place`}>
            <Lable>Place:</Lable>
            <Text>{location}</Text>
          </LiInfo>
          <LiInfo key={`${_id}+age`}>
            <Lable>Age:</Lable>
            <Text>
              {birthdate ? parseDate(birthdate).split('.').join('/') : ''}
            </Text>
          </LiInfo>
          {price ? (
            <LiInfo key={`${_id}+price`}>
              <Lable>Price:</Lable>
              <Text>{price}$</Text>
            </LiInfo>
          ) : (
            ''
          )}
        </ListInfo>

        <ThumbBtn>
          <NoticeBtn onClick={onOpenModal} text={'Learn More'} />
          {showModal && (
            <Modal
              closeModal={toggleModal}
              children={<NoticeModal notice={data} />}
            ></Modal>
          )}
          {isAuth && <NoticeBtn text={'Delete'} />}
        </ThumbBtn>
      </Wrap>
    </ListItem>
  );
};
