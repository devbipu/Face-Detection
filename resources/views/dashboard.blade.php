<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg py-4">
                <div class="attencande_wrap">
                    <div class="video_wrapper">
                        <video id="video" width="600" height="450" autoplay>
                    </div>
                    <div>
                        <div class="flex items-center justify-center">
                            <div class="max-w-xs">
                                <div class="bg-white shadow-xl rounded-lg py-3" id="profile_wrap">
                                    <div class="photo-wrapper p-2">
                                        <img class="w-32 h-32 rounded-full mx-auto" src=""  alt="John Doe">
                                    </div>
                                    <div class="p-2">
                                        <h3 class="text-center text-xl text-gray-900 font-medium leading-8">Joh Doe</h3>
                                        <div class="text-center text-gray-400 text-xs font-semibold">
                                            <p>Web Developer</p>
                                        </div>
                                        <table class="text-xs my-3">
                                            <tbody><tr>
                                                <td class="px-2 py-2 text-gray-500 font-semibold">Address</td>
                                                <td class="px-2 py-2">Chatakpur-3, Dhangadhi Kailali</td>
                                            </tr>
                                            <tr>
                                                <td class="px-2 py-2 text-gray-500 font-semibold">Phone</td>
                                                <td class="px-2 py-2">+977 9955221114</td>
                                            </tr>
                                            <tr>
                                                <td class="px-2 py-2 text-gray-500 font-semibold">Email</td>
                                                <td class="px-2 py-2">john@exmaple.com</td>
                                            </tr>
                                        </tbody></table>

                                        <div class="text-center my-3">
                                            <a class="text-xs text-indigo-500 italic hover:underline hover:text-indigo-600 font-medium" href="#">View Profile</a>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
