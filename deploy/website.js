KN.Site({
    title: "KarimNassar.com",
    mode: KN.SiteMode.Test,
    sitemap: {
        "index": new KN.Page({
            type: KN.PageType.Index,
            name: "KarimNassar.com",
            menu: {
                name: 'Home',
                sub: [
                    {path: 'code/model-kit', name: 'Model Kit for iOS'},
                    {path: 'code/web/textgauge', name: 'textGuage jQuery Plugin'},
                    {path: 'makery/scale-modeling', name: 'Scale Modeling'}
                ]
            }
        }),
        "makery": new KN.Page({
            type: KN.PageType.Index,
            name: "Makery",
            subPages: {
                "my-workshop": new KN.Page({
                    type: KN.PageType.Article,
                    name: "My Workshop"
                }),
                "scale-modeling": new KN.Page({
                    type: KN.PageType.Index,
                    name: "Scale Modeling",
                    subPages: {
                        "m882": new KN.Page({
                            type: KN.PageType.Article,
                            name: "SSC M-882 Plasma Grenade"
                        }),
                        "m2088": new KN.Page({
                            type: KN.PageType.Article,
                            name: "SSC M-2088 Plasma Sidearm"
                        }),
                        "shooting-star": new KN.Page({
                            type: KN.PageType.Article,
                            name: "Shooting Star"
                        }),
                        "talon-refit": new KN.Page({
                            type: KN.PageType.Article,
                            name: "Talon Refit"
                        }),
                        "daedalus": new KN.Page({
                            type: KN.PageType.Article,
                            name: "Deadalus Re-Imagined"
                        }),
                        "m-wing": new KN.Page({
                            type: KN.PageType.Article,
                            name: "M-Wing"
                        }),
                        "m1104": new KN.Page({
                            type: KN.PageType.Article,
                            name: "M1104 Plasma Sidearm"
                        }),
                        "talon": new KN.Page({
                            type: KN.PageType.Article,
                            name: "Talon Class Frigate"
                        }),
                        "moldy-crow": new KN.Page({
                            type: KN.PageType.Article,
                            name: "The Moldy Crow"
                        }),
                        "ayanami-rei": new KN.Page({
                            type: KN.PageType.Article,
                            name: "Ayanami Rei"
                        })
                    }
                })
            },
            menu: {
                sub: [
                    { path: 'makery/my-workshop', name: 'My Workshop' },
                    { path: 'makery/scale-modeling', name: 'Scale Modeling' },
                    { deep: true, path: 'makery/scale-modeling/m882', name: 'SSC M-882 Plasma Grenade' },
                    { deep: true, path: 'makery/scale-modeling/m2088', name: 'SSC M-2088 Plasma Sidearm' },
                    { deep: true, path: 'makery/scale-modeling/shooting-star', name: 'Shooting Star' },
                    { deep: true, path: 'makery/scale-modeling/talon-refit', name: 'Talon Refit' },
                    { subtitle: true, path: false, name: 'Older Projects' },
                    { deep: true, path: 'makery/scale-modeling/daedalus', name: 'Deadalus Re-Imagined' },
                    { deep: true, path: 'makery/scale-modeling/m-wing', name: 'M-Wing' },
                    { deep: true, path: 'makery/scale-modeling/m1104', name: 'M1104 Plasma Sidearm' },
                    { deep: true, path: 'makery/scale-modeling/talon', name: 'Talon Class Frigate' },
                    { deep: true, path: 'makery/scale-modeling/moldy-crow', name: 'The Moldy Crow' },
                    { deep: true, path: 'makery/scale-modeling/ayanami-rei', name: 'Ayanami Rei' }
                ]
            }
        }),
        "code": new KN.Page({
            type: KN.PageType.Index,
            name: "Code",
            subPages: {
                "modek-kit": new KN.Page({
                    type: KN.PageType.Article,
                    name: "Model Kit for iOS"
                }),
                "web": new KN.Page({
                    type: KN.PageType.Index,
                    name: "Web Hackery",
                    subPages: {
                        "textgauge": new KN.Page({
                            type: KN.PageType.Article,
                            name: "TextGauge jQuery Plugin"
                        }),
                        "css-icons": new KN.Page({
                            type: KN.PageType.Article,
                            name: "Pure CSS Icons"
                        }),
                        "pure-css-glossy-button": new KN.Page({
                            type: KN.PageType.Article,
                            name: "Pure CSS Glossy Button"
                        })
                    }
                })
            },
            menu: {
                sub: [
                    { path: 'code/model-kit', name: 'Model Kit for iOS' },
                    { path: 'code/web', name: 'Web Hackery' },
                    { deep: true, path: 'code/web/css-icons', name: 'Pure CSS Icons' },
                    { deep: true, path: 'code/web/textgauge', name: 'TextGauge jQuery Plugin' },
                    { deep: true, path: 'code/web/pure-css-glossy-button', name: 'Pure CSS Glossy Button' }
                ]
            }
        }),
        "photography": new KN.Page({
            type: KN.PageType.Index,
            name: "Photography",
            subPages: {
                "home-wildlife": new KN.Page({
                    type: KN.PageType.Article,
                    name: "Home Wildlife"
                }),
                "us-southwest": new KN.Page({
                    type: KN.PageType.Article,
                    name: "US Southwest Tour"
                }),
                "kauai": new KN.Page({
                    type: KN.PageType.Article,
                    name: "Kauai, Hawaii"
                })
            },
            menu: {
                sub: [
                    { deep: true, path: 'photography/home-wildlife', name: 'Home Wildlife' },
                    { deep: true, path: 'photography/us-southwest', name: 'US Southwest' },
                    { deep: true, path: 'photography/kauai', name: 'Kauai, Hawaii' }
                ]
            }
        }),
        "about": new KN.Page({
            type: KN.PageType.Index,
            name: "About",
            subPages: {
                "resume": new KN.Page({
                    type: KN.PageType.Article,
                    name: "Karim Nassar's Resume"
                }),
                "this-site": new KN.Page({
                    type: KN.PageType.Article,
                    name: "About this Site"
                })
            },
            menu: {
                path: 'about',
                sub: [
                    { deep: true, path: 'about/resume', name: "My Resume" },
                    { deep: true, path: 'about/this-site', name: "About this Site" }
                ]
            }
        })
    }
});