import SpotifyWebApi from "spotify-web-api-node";

//通过下面这个变量，告诉spotify给我们哪些权限，也就是说我们可以通过spotify api进行哪些操作
const scopes = [
    "user-read-email",
    "playlist-read-private",
    "playlist-read-collaborative",
    "streaming",
    "user-read-private",
    "user-library-read",
    "user-top-read",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
    "user-read-recently-played",
    "user-follow-read",
//通过join操作，我们将数组变成了以逗号分割的，数组元素组成的长字符串，例如："user-read-email,playlist-read-private, ..."
].join(",");

const params = {
    scope: scopes,
};

const queryParamString = new URLSearchParams(params);

//https://accounts.spotify.com/authorize?params=user-read-email,playlist-read-private,...
const LOGIN_URL = `https://accounts.spotify.com/authorize?${queryParamString.toString()}`;

const spotifyApi = new SpotifyWebApi({
    clientId:process.env.NEXT_PUBLIC_CLIENT_ID,
    clientSecret:process.env.NEXT_PUBLIC_CLIENT_SECRET
});

//默认导出，也就是说如果在import此文件的内容时，没有明确指定要导入的内容,就会导入此对象
export default spotifyApi;

//如果在import此文件的内容时，明确指定了要导入的内容，例如 import {LOGIN_URL} from '/lib/spotify.js'，就导入此对象
export {LOGIN_URL};