'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">test-nest-js documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AppModule-27f70d62d51faac3d85d8e3c29158e1b743da8baeaf69737e55ad3961f85a76742a08f1333dbe238e8f8280f629dcbffa92d5cea63f2c9f1cced0febaebc4eb1"' : 'data-bs-target="#xs-controllers-links-module-AppModule-27f70d62d51faac3d85d8e3c29158e1b743da8baeaf69737e55ad3961f85a76742a08f1333dbe238e8f8280f629dcbffa92d5cea63f2c9f1cced0febaebc4eb1"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-27f70d62d51faac3d85d8e3c29158e1b743da8baeaf69737e55ad3961f85a76742a08f1333dbe238e8f8280f629dcbffa92d5cea63f2c9f1cced0febaebc4eb1"' :
                                            'id="xs-controllers-links-module-AppModule-27f70d62d51faac3d85d8e3c29158e1b743da8baeaf69737e55ad3961f85a76742a08f1333dbe238e8f8280f629dcbffa92d5cea63f2c9f1cced0febaebc4eb1"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-27f70d62d51faac3d85d8e3c29158e1b743da8baeaf69737e55ad3961f85a76742a08f1333dbe238e8f8280f629dcbffa92d5cea63f2c9f1cced0febaebc4eb1"' : 'data-bs-target="#xs-injectables-links-module-AppModule-27f70d62d51faac3d85d8e3c29158e1b743da8baeaf69737e55ad3961f85a76742a08f1333dbe238e8f8280f629dcbffa92d5cea63f2c9f1cced0febaebc4eb1"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-27f70d62d51faac3d85d8e3c29158e1b743da8baeaf69737e55ad3961f85a76742a08f1333dbe238e8f8280f629dcbffa92d5cea63f2c9f1cced0febaebc4eb1"' :
                                        'id="xs-injectables-links-module-AppModule-27f70d62d51faac3d85d8e3c29158e1b743da8baeaf69737e55ad3961f85a76742a08f1333dbe238e8f8280f629dcbffa92d5cea63f2c9f1cced0febaebc4eb1"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthorizationModule.html" data-type="entity-link" >AuthorizationModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/BookModule.html" data-type="entity-link" >BookModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-BookModule-2655feea390215a39155bed3d1baf4454cc0fa1f1ddf70313f0612c50f88a8f829ab8311dc6db86d940b0f708555fd04a5646b61a95fe0a1e829dad261f27187"' : 'data-bs-target="#xs-controllers-links-module-BookModule-2655feea390215a39155bed3d1baf4454cc0fa1f1ddf70313f0612c50f88a8f829ab8311dc6db86d940b0f708555fd04a5646b61a95fe0a1e829dad261f27187"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-BookModule-2655feea390215a39155bed3d1baf4454cc0fa1f1ddf70313f0612c50f88a8f829ab8311dc6db86d940b0f708555fd04a5646b61a95fe0a1e829dad261f27187"' :
                                            'id="xs-controllers-links-module-BookModule-2655feea390215a39155bed3d1baf4454cc0fa1f1ddf70313f0612c50f88a8f829ab8311dc6db86d940b0f708555fd04a5646b61a95fe0a1e829dad261f27187"' }>
                                            <li class="link">
                                                <a href="controllers/BookController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BookController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-BookModule-2655feea390215a39155bed3d1baf4454cc0fa1f1ddf70313f0612c50f88a8f829ab8311dc6db86d940b0f708555fd04a5646b61a95fe0a1e829dad261f27187"' : 'data-bs-target="#xs-injectables-links-module-BookModule-2655feea390215a39155bed3d1baf4454cc0fa1f1ddf70313f0612c50f88a8f829ab8311dc6db86d940b0f708555fd04a5646b61a95fe0a1e829dad261f27187"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-BookModule-2655feea390215a39155bed3d1baf4454cc0fa1f1ddf70313f0612c50f88a8f829ab8311dc6db86d940b0f708555fd04a5646b61a95fe0a1e829dad261f27187"' :
                                        'id="xs-injectables-links-module-BookModule-2655feea390215a39155bed3d1baf4454cc0fa1f1ddf70313f0612c50f88a8f829ab8311dc6db86d940b0f708555fd04a5646b61a95fe0a1e829dad261f27187"' }>
                                        <li class="link">
                                            <a href="injectables/BookService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BookService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SsoModule.html" data-type="entity-link" >SsoModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-SsoModule-b8af587fd1e6078bf36a6511fcdfbfbe99941f9a2799b124164b8ed885c7a28e4b4e9a8549db268567f359284c245ffb938bbae67d6d2bdf7bcac0ae0264096e"' : 'data-bs-target="#xs-controllers-links-module-SsoModule-b8af587fd1e6078bf36a6511fcdfbfbe99941f9a2799b124164b8ed885c7a28e4b4e9a8549db268567f359284c245ffb938bbae67d6d2bdf7bcac0ae0264096e"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-SsoModule-b8af587fd1e6078bf36a6511fcdfbfbe99941f9a2799b124164b8ed885c7a28e4b4e9a8549db268567f359284c245ffb938bbae67d6d2bdf7bcac0ae0264096e"' :
                                            'id="xs-controllers-links-module-SsoModule-b8af587fd1e6078bf36a6511fcdfbfbe99941f9a2799b124164b8ed885c7a28e4b4e9a8549db268567f359284c245ffb938bbae67d6d2bdf7bcac0ae0264096e"' }>
                                            <li class="link">
                                                <a href="controllers/SsoController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SsoController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-SsoModule-b8af587fd1e6078bf36a6511fcdfbfbe99941f9a2799b124164b8ed885c7a28e4b4e9a8549db268567f359284c245ffb938bbae67d6d2bdf7bcac0ae0264096e"' : 'data-bs-target="#xs-injectables-links-module-SsoModule-b8af587fd1e6078bf36a6511fcdfbfbe99941f9a2799b124164b8ed885c7a28e4b4e9a8549db268567f359284c245ffb938bbae67d6d2bdf7bcac0ae0264096e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SsoModule-b8af587fd1e6078bf36a6511fcdfbfbe99941f9a2799b124164b8ed885c7a28e4b4e9a8549db268567f359284c245ffb938bbae67d6d2bdf7bcac0ae0264096e"' :
                                        'id="xs-injectables-links-module-SsoModule-b8af587fd1e6078bf36a6511fcdfbfbe99941f9a2799b124164b8ed885c7a28e4b4e9a8549db268567f359284c245ffb938bbae67d6d2bdf7bcac0ae0264096e"' }>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SsoService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SsoService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UploadModule.html" data-type="entity-link" >UploadModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UploadModule-371a9253916b279c38d9dfbe1136c6cf403ff32f071e134ec3dabdb97fd120be7c81fbcddd6f08618fdcf899c42e2d26b9e8e58575b00c6e81d96517112ffb5d"' : 'data-bs-target="#xs-controllers-links-module-UploadModule-371a9253916b279c38d9dfbe1136c6cf403ff32f071e134ec3dabdb97fd120be7c81fbcddd6f08618fdcf899c42e2d26b9e8e58575b00c6e81d96517112ffb5d"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UploadModule-371a9253916b279c38d9dfbe1136c6cf403ff32f071e134ec3dabdb97fd120be7c81fbcddd6f08618fdcf899c42e2d26b9e8e58575b00c6e81d96517112ffb5d"' :
                                            'id="xs-controllers-links-module-UploadModule-371a9253916b279c38d9dfbe1136c6cf403ff32f071e134ec3dabdb97fd120be7c81fbcddd6f08618fdcf899c42e2d26b9e8e58575b00c6e81d96517112ffb5d"' }>
                                            <li class="link">
                                                <a href="controllers/UploadController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UploadController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UploadModule-371a9253916b279c38d9dfbe1136c6cf403ff32f071e134ec3dabdb97fd120be7c81fbcddd6f08618fdcf899c42e2d26b9e8e58575b00c6e81d96517112ffb5d"' : 'data-bs-target="#xs-injectables-links-module-UploadModule-371a9253916b279c38d9dfbe1136c6cf403ff32f071e134ec3dabdb97fd120be7c81fbcddd6f08618fdcf899c42e2d26b9e8e58575b00c6e81d96517112ffb5d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UploadModule-371a9253916b279c38d9dfbe1136c6cf403ff32f071e134ec3dabdb97fd120be7c81fbcddd6f08618fdcf899c42e2d26b9e8e58575b00c6e81d96517112ffb5d"' :
                                        'id="xs-injectables-links-module-UploadModule-371a9253916b279c38d9dfbe1136c6cf403ff32f071e134ec3dabdb97fd120be7c81fbcddd6f08618fdcf899c42e2d26b9e8e58575b00c6e81d96517112ffb5d"' }>
                                        <li class="link">
                                            <a href="injectables/UploadService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UploadService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link" >UsersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UsersModule-43b46c3dab2d190a54f2f92bc6f2fb43d5ab0af780d49e0faa9093113a1afef3c6147ae4b3d9138a647d07efe118d6cbabce482580450c7e3cbe7deae36abbda"' : 'data-bs-target="#xs-controllers-links-module-UsersModule-43b46c3dab2d190a54f2f92bc6f2fb43d5ab0af780d49e0faa9093113a1afef3c6147ae4b3d9138a647d07efe118d6cbabce482580450c7e3cbe7deae36abbda"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UsersModule-43b46c3dab2d190a54f2f92bc6f2fb43d5ab0af780d49e0faa9093113a1afef3c6147ae4b3d9138a647d07efe118d6cbabce482580450c7e3cbe7deae36abbda"' :
                                            'id="xs-controllers-links-module-UsersModule-43b46c3dab2d190a54f2f92bc6f2fb43d5ab0af780d49e0faa9093113a1afef3c6147ae4b3d9138a647d07efe118d6cbabce482580450c7e3cbe7deae36abbda"' }>
                                            <li class="link">
                                                <a href="controllers/UsersController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UsersModule-43b46c3dab2d190a54f2f92bc6f2fb43d5ab0af780d49e0faa9093113a1afef3c6147ae4b3d9138a647d07efe118d6cbabce482580450c7e3cbe7deae36abbda"' : 'data-bs-target="#xs-injectables-links-module-UsersModule-43b46c3dab2d190a54f2f92bc6f2fb43d5ab0af780d49e0faa9093113a1afef3c6147ae4b3d9138a647d07efe118d6cbabce482580450c7e3cbe7deae36abbda"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UsersModule-43b46c3dab2d190a54f2f92bc6f2fb43d5ab0af780d49e0faa9093113a1afef3c6147ae4b3d9138a647d07efe118d6cbabce482580450c7e3cbe7deae36abbda"' :
                                        'id="xs-injectables-links-module-UsersModule-43b46c3dab2d190a54f2f92bc6f2fb43d5ab0af780d49e0faa9093113a1afef3c6147ae4b3d9138a647d07efe118d6cbabce482580450c7e3cbe7deae36abbda"' }>
                                        <li class="link">
                                            <a href="injectables/UsersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/WeatherModule.html" data-type="entity-link" >WeatherModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-WeatherModule-13aa7714fbf72531b8a9ab42c1099ffab28971c322db220ac62b6cf120c98290561a7df3ba23156da71ab9c453a2ce556c393a3425ff2d946101c4f4925465c2"' : 'data-bs-target="#xs-controllers-links-module-WeatherModule-13aa7714fbf72531b8a9ab42c1099ffab28971c322db220ac62b6cf120c98290561a7df3ba23156da71ab9c453a2ce556c393a3425ff2d946101c4f4925465c2"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-WeatherModule-13aa7714fbf72531b8a9ab42c1099ffab28971c322db220ac62b6cf120c98290561a7df3ba23156da71ab9c453a2ce556c393a3425ff2d946101c4f4925465c2"' :
                                            'id="xs-controllers-links-module-WeatherModule-13aa7714fbf72531b8a9ab42c1099ffab28971c322db220ac62b6cf120c98290561a7df3ba23156da71ab9c453a2ce556c393a3425ff2d946101c4f4925465c2"' }>
                                            <li class="link">
                                                <a href="controllers/WeatherController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WeatherController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-WeatherModule-13aa7714fbf72531b8a9ab42c1099ffab28971c322db220ac62b6cf120c98290561a7df3ba23156da71ab9c453a2ce556c393a3425ff2d946101c4f4925465c2"' : 'data-bs-target="#xs-injectables-links-module-WeatherModule-13aa7714fbf72531b8a9ab42c1099ffab28971c322db220ac62b6cf120c98290561a7df3ba23156da71ab9c453a2ce556c393a3425ff2d946101c4f4925465c2"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-WeatherModule-13aa7714fbf72531b8a9ab42c1099ffab28971c322db220ac62b6cf120c98290561a7df3ba23156da71ab9c453a2ce556c393a3425ff2d946101c4f4925465c2"' :
                                        'id="xs-injectables-links-module-WeatherModule-13aa7714fbf72531b8a9ab42c1099ffab28971c322db220ac62b6cf120c98290561a7df3ba23156da71ab9c453a2ce556c393a3425ff2d946101c4f4925465c2"' }>
                                        <li class="link">
                                            <a href="injectables/WeatherService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WeatherService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/WechatyModule.html" data-type="entity-link" >WechatyModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-WechatyModule-2d791541f0d962a28efe94e8695dbfe417244dd209d27713406d4ce8a73d59743726455180ff29c82136a2b8de1d829e6190cabe817d7252d7dcd20d60c4f49a"' : 'data-bs-target="#xs-controllers-links-module-WechatyModule-2d791541f0d962a28efe94e8695dbfe417244dd209d27713406d4ce8a73d59743726455180ff29c82136a2b8de1d829e6190cabe817d7252d7dcd20d60c4f49a"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-WechatyModule-2d791541f0d962a28efe94e8695dbfe417244dd209d27713406d4ce8a73d59743726455180ff29c82136a2b8de1d829e6190cabe817d7252d7dcd20d60c4f49a"' :
                                            'id="xs-controllers-links-module-WechatyModule-2d791541f0d962a28efe94e8695dbfe417244dd209d27713406d4ce8a73d59743726455180ff29c82136a2b8de1d829e6190cabe817d7252d7dcd20d60c4f49a"' }>
                                            <li class="link">
                                                <a href="controllers/WechatyController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WechatyController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-WechatyModule-2d791541f0d962a28efe94e8695dbfe417244dd209d27713406d4ce8a73d59743726455180ff29c82136a2b8de1d829e6190cabe817d7252d7dcd20d60c4f49a"' : 'data-bs-target="#xs-injectables-links-module-WechatyModule-2d791541f0d962a28efe94e8695dbfe417244dd209d27713406d4ce8a73d59743726455180ff29c82136a2b8de1d829e6190cabe817d7252d7dcd20d60c4f49a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-WechatyModule-2d791541f0d962a28efe94e8695dbfe417244dd209d27713406d4ce8a73d59743726455180ff29c82136a2b8de1d829e6190cabe817d7252d7dcd20d60c4f49a"' :
                                        'id="xs-injectables-links-module-WechatyModule-2d791541f0d962a28efe94e8695dbfe417244dd209d27713406d4ce8a73d59743726455180ff29c82136a2b8de1d829e6190cabe817d7252d7dcd20d60c4f49a"' }>
                                        <li class="link">
                                            <a href="injectables/WechatyService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WechatyService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/WinstonModule.html" data-type="entity-link" >WinstonModule</a>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#controllers-links"' :
                                'data-bs-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AppController.html" data-type="entity-link" >AppController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/BookController.html" data-type="entity-link" >BookController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/SsoController.html" data-type="entity-link" >SsoController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/UploadController.html" data-type="entity-link" >UploadController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/UsersController.html" data-type="entity-link" >UsersController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/WeatherController.html" data-type="entity-link" >WeatherController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/WechatyController.html" data-type="entity-link" >WechatyController</a>
                                </li>
                            </ul>
                        </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#entities-links"' :
                                'data-bs-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/BookEntity.html" data-type="entity-link" >BookEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/UserEntity.html" data-type="entity-link" >UserEntity</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/ClassValidatePipe.html" data-type="entity-link" >ClassValidatePipe</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateBookDto.html" data-type="entity-link" >CreateBookDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/HttpExceptionFilter.html" data-type="entity-link" >HttpExceptionFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/MyLogger.html" data-type="entity-link" >MyLogger</a>
                            </li>
                            <li class="link">
                                <a href="classes/SsoLoginDto.html" data-type="entity-link" >SsoLoginDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateBookDto.html" data-type="entity-link" >UpdateBookDto</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AppService.html" data-type="entity-link" >AppService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthorizationService.html" data-type="entity-link" >AuthorizationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BookService.html" data-type="entity-link" >BookService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DurationInterceptor.html" data-type="entity-link" >DurationInterceptor</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FileSizeValidatePipe.html" data-type="entity-link" >FileSizeValidatePipe</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtStrategy.html" data-type="entity-link" >JwtStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LoggerMiddleware.html" data-type="entity-link" >LoggerMiddleware</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SsoService.html" data-type="entity-link" >SsoService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TransformIntercepter.html" data-type="entity-link" >TransformIntercepter</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UploadService.html" data-type="entity-link" >UploadService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsersService.html" data-type="entity-link" >UsersService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/WeatherService.html" data-type="entity-link" >WeatherService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/WechatyService.html" data-type="entity-link" >WechatyService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ZodValidationPipe.html" data-type="entity-link" >ZodValidationPipe</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link" >AuthGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/RoleGuard.html" data-type="entity-link" >RoleGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/RegisterOptions.html" data-type="entity-link" >RegisterOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/User.html" data-type="entity-link" >User</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});