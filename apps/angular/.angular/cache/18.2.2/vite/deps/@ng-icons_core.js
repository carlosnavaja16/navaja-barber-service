import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Inject,
  InjectionToken,
  Injector,
  Input,
  NgModule,
  Optional,
  SkipSelf,
  inject,
  runInInjectionContext,
  setClassMetadata,
  ɵɵStandaloneFeature,
  ɵɵdefineComponent,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵinject,
  ɵɵstyleProp
} from "./chunk-PJI43AEF.js";
import "./chunk-OME3B2Y6.js";
import {
  firstValueFrom,
  isObservable
} from "./chunk-XTZO27KL.js";
import "./chunk-BO5GAICC.js";
import {
  __async,
  __spreadValues
} from "./chunk-5K356HEJ.js";

// ../../node_modules/@ng-icons/core/fesm2022/ng-icons-core.mjs
var NgIconConfigToken = new InjectionToken("Ng Icon Config");
var defaultConfig = {
  size: "1em"
};
function provideNgIconsConfig(config) {
  return {
    provide: NgIconConfigToken,
    useValue: __spreadValues(__spreadValues({}, defaultConfig), config)
  };
}
function injectNgIconConfig() {
  return inject(NgIconConfigToken, {
    optional: true
  }) ?? defaultConfig;
}
var NgIconLoaderToken = new InjectionToken("Ng Icon Loader Token");
function loaderFeature(kind, providers) {
  return {
    kind,
    providers
  };
}
var NgIconCacheToken = new InjectionToken("Ng Icon Cache Token");
function withCaching() {
  return loaderFeature(0, [{
    provide: NgIconCacheToken,
    useValue: /* @__PURE__ */ new Map()
  }]);
}
function provideNgIconLoader(loader, ...features) {
  return [{
    provide: NgIconLoaderToken,
    useValue: loader
  }, features.map((feature) => feature.providers)];
}
function injectNgIconLoader() {
  return inject(NgIconLoaderToken, {
    optional: true
  });
}
function injectNgIconLoaderCache() {
  return inject(NgIconCacheToken, {
    optional: true
  });
}
function provideIcons(icons) {
  return [{
    provide: NgIconsToken,
    useFactory: (parentIcons) => __spreadValues(__spreadValues({}, parentIcons?.reduce((acc, icons2) => __spreadValues(__spreadValues({}, acc), icons2), {})), icons),
    deps: [[NgIconsToken, new Optional(), new SkipSelf()]],
    multi: true
  }];
}
var NgIconsToken = new InjectionToken("Icons Token");
function injectNgIcons() {
  return inject(NgIconsToken, {
    optional: true
  }) ?? [];
}
function coerceLoaderResult(result) {
  if (typeof result === "string") {
    return Promise.resolve(result);
  }
  if (isObservable(result)) {
    return firstValueFrom(result);
  }
  return result;
}
function toPropertyName(str) {
  return str.replace(/([^a-zA-Z0-9])+(.)?/g, (_, __, chr) => chr ? chr.toUpperCase() : "").replace(/[^a-zA-Z\d]/g, "").replace(/^([A-Z])/, (m) => m.toLowerCase());
}
var _NgIcon = class _NgIcon {
  constructor() {
    this.config = injectNgIconConfig();
    this.icons = injectNgIcons();
    this.loader = injectNgIconLoader();
    this.cache = injectNgIconLoaderCache();
    this.injector = inject(Injector);
    this.elementRef = inject(ElementRef);
    this._size = this.config.size;
    this.color = this.config.color;
  }
  /** Define the name of the icon to display */
  set name(name) {
    this.setIcon(name);
  }
  /** Define the size of the icon */
  set size(size) {
    this._size = coerceCssPixelValue(size);
  }
  get size() {
    return this._size;
  }
  /**
   * Load the icon with the given name and insert it into the template.
   * @param name The name of the icon to load.
   */
  setIcon(name) {
    return __async(this, null, function* () {
      const propertyName = toPropertyName(name);
      for (const icons of [...this.icons].reverse()) {
        if (icons[propertyName]) {
          this.elementRef.nativeElement.innerHTML = icons[propertyName];
          return;
        }
      }
      if (this.cache?.has(name)) {
        this.elementRef.nativeElement.innerHTML = this.cache.get(name);
        return;
      }
      if (this.loader) {
        const result = yield this.requestIconFromLoader(name);
        if (result !== null) {
          this.cache?.set(name, result);
          this.elementRef.nativeElement.innerHTML = result;
          return;
        }
      }
      console.warn(`No icon named ${name} was found. You may need to import it using the withIcons function.`);
    });
  }
  /**
   * Request the icon from the loader.
   * @param name The name of the icon to load.
   * @returns The SVG content for a given icon name.
   */
  requestIconFromLoader(name) {
    return new Promise((resolve) => {
      runInInjectionContext(this.injector, () => __async(this, null, function* () {
        const result = yield coerceLoaderResult(this.loader(name));
        resolve(result);
      }));
    });
  }
};
_NgIcon.ɵfac = function NgIcon_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _NgIcon)();
};
_NgIcon.ɵcmp = ɵɵdefineComponent({
  type: _NgIcon,
  selectors: [["ng-icon"]],
  hostVars: 6,
  hostBindings: function NgIcon_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵstyleProp("--ng-icon__size", ctx.size)("--ng-icon__stroke-width", ctx.strokeWidth)("color", ctx.color);
    }
  },
  inputs: {
    name: "name",
    size: "size",
    strokeWidth: "strokeWidth",
    color: "color"
  },
  standalone: true,
  features: [ɵɵStandaloneFeature],
  decls: 0,
  vars: 0,
  template: function NgIcon_Template(rf, ctx) {
  },
  styles: ["[_nghost-%COMP%]{display:inline-block;width:var(--ng-icon__size);height:var(--ng-icon__size)}"],
  changeDetection: 0
});
var NgIcon = _NgIcon;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgIcon, [{
    type: Component,
    args: [{
      selector: "ng-icon",
      template: "",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      styles: [":host{display:inline-block;width:var(--ng-icon__size);height:var(--ng-icon__size)}\n"]
    }]
  }], null, {
    name: [{
      type: Input
    }],
    size: [{
      type: HostBinding,
      args: ["style.--ng-icon__size"]
    }, {
      type: Input
    }],
    strokeWidth: [{
      type: HostBinding,
      args: ["style.--ng-icon__stroke-width"]
    }, {
      type: Input
    }],
    color: [{
      type: HostBinding,
      args: ["style.color"]
    }, {
      type: Input
    }]
  });
})();
function coerceCssPixelValue(value) {
  return value == null ? "" : /^\d+$/.test(value) ? `${value}px` : value;
}
var _NgIconsModule = class _NgIconsModule {
  constructor(icons) {
    if (Object.keys(icons).length === 0) {
      throw new Error("No icons have been provided. Ensure to include some icons by importing them using NgIconsModule.withIcons({ ... }).");
    }
  }
  /**
   * Define the icons that will be included in the application. This allows unused icons to
   * be tree-shaken away to reduce bundle size
   * @param icons The object containing the required icons
   */
  static withIcons(icons) {
    return {
      ngModule: _NgIconsModule,
      providers: provideIcons(icons)
    };
  }
};
_NgIconsModule.ɵfac = function NgIconsModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _NgIconsModule)(ɵɵinject(NgIconsToken));
};
_NgIconsModule.ɵmod = ɵɵdefineNgModule({
  type: _NgIconsModule,
  imports: [NgIcon],
  exports: [NgIcon]
});
_NgIconsModule.ɵinj = ɵɵdefineInjector({});
var NgIconsModule = _NgIconsModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgIconsModule, [{
    type: NgModule,
    args: [{
      imports: [NgIcon],
      exports: [NgIcon]
    }]
  }], function() {
    return [{
      type: void 0,
      decorators: [{
        type: Inject,
        args: [NgIconsToken]
      }]
    }];
  }, null);
})();
var NG_ICON_DIRECTIVES = [NgIcon];
export {
  NG_ICON_DIRECTIVES,
  NgIcon,
  NgIconCacheToken,
  NgIcon as NgIconComponent,
  NgIconConfigToken,
  NgIconLoaderToken,
  NgIconsModule,
  NgIconsToken,
  injectNgIconConfig,
  injectNgIconLoader,
  injectNgIconLoaderCache,
  injectNgIcons,
  provideIcons,
  provideNgIconLoader,
  provideNgIconsConfig,
  withCaching
};
//# sourceMappingURL=@ng-icons_core.js.map
