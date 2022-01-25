import { 
    HomeIcon,
    SearchIcon,
    LibraryIcon,
    PlusCircleIcon,
    HeartIcon,
    RssIcon,
    LogoutIcon
} from "@heroicons/react/outline"

import { useEffect, useState } from "react";
import useSpotify from "../hooks/useSpotify";
import { signOut, useSession } from "next-auth/react"

function Sidebar() {
    const spotifyApi = useSpotify();
    const {data: session, status} = useSession();
    const [playlists, setPlaylists] = useState([]);

    useEffect(()=>{
        if(spotifyApi.getAccessToken()){
            spotifyApi.getUserPlaylists().then((data) => {  
                setPlaylists(data.body.items);
            });
        }
    },[session, spotifyApi]);

    console.log(playlists);

    return (
        <div className="text-gray-500 p-5 text-sm border-r  border-gray-900
            overflow-y-scroll scrollbar-hide h-screen"> 
            <div className="space-y-4">
                <button className="flex items-center space-x-2 hover:text-white"
                    onClick={() => signOut()}
                >
                    <LogoutIcon className="h-5 w-5"/>
                    <p>退出</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <HomeIcon className="h-5 w-5"/>
                    <p>主页</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <SearchIcon className="h-5 w-5"/>
                    <p>搜索</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <LibraryIcon className="h-5 w-5"/>
                    <p>音乐库</p>
                </button>
                <hr className="border-t-[0.1px] border-gray-900"/>

                <button className="flex items-center space-x-2 hover:text-white">
                    <PlusCircleIcon className="h-5 w-5"/>
                    <p>创建歌单</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <HeartIcon className="h-5 w-5"/>
                    <p>喜欢的歌曲</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <RssIcon className="h-5 w-5"/>
                    <p>你的歌单</p>
                </button>
                <hr className="border-t-[0.1px] border-gray-900"/>

                {/*Playlists... */}
                {
                    playlists.map(playlist => {
                        return(
                            <p key={playlist.id} className="cursor-pointer hover:text-white">
                                {playlist.name}
                            </p>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Sidebar


