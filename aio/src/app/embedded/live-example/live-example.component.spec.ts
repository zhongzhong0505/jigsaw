/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement, ElementRef } from '@angular/core';
import { Location } from '@angular/common';

import { LiveExampleComponent, EmbeddedPlunkerComponent } from './live-example.component';

const defaultTestPath = '/test';

describe('LiveExampleComponent', () => {
  let hostComponent: HostComponent;
  let liveExampleDe: DebugElement;
  let liveExampleComponent: LiveExampleComponent;
  let fixture: ComponentFixture<HostComponent>;
  let testPath: string;
  let liveExampleContent: string;

  //////// test helpers ////////

  @Component({
    selector: 'aio-host-comp',
    template: `<live-example></live-example>`
  })
  class HostComponent { }

  class TestLocation {
    path() { return testPath; }
  }

  function setHostTemplate(template: string) {
    TestBed.overrideComponent(HostComponent, {set: {template}});
  }

  function testComponent(testFn: () => void) {
    return TestBed
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HostComponent);
        hostComponent = fixture.componentInstance;
        liveExampleDe = fixture.debugElement.children[0];
        liveExampleComponent = liveExampleDe.componentInstance;

        // Copy the LiveExample's innerHTML (content)
        // into the `liveExampleContent` property as the DocViewer does
        liveExampleDe.nativeElement.liveExampleContent = liveExampleContent;

        fixture.detectChanges();
      })
      .then(testFn);
  }

  //////// tests ////////
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ HostComponent, LiveExampleComponent, EmbeddedPlunkerComponent ],
      providers: [ {provide: Location, useClass: TestLocation }]
    })
    // Disable the <iframe> within the EmbeddedPlunkerComponent
    .overrideComponent(EmbeddedPlunkerComponent, {set: {template: 'NO IFRAME'}});

    testPath = defaultTestPath;
    liveExampleContent = undefined;
  });

  describe('when not embedded', () => {

    function getAnchors() {
      return liveExampleDe.queryAll(By.css('a')).map(de => de.nativeElement as HTMLAnchorElement);
    }
    function getHrefs() { return getAnchors().map(a => a.href); }
    function getLiveExampleAnchor() { return getAnchors()[0]; }
    function getDownloadAnchor() { return getAnchors()[1]; }

    it('should create LiveExampleComponent', async(() => {
      testComponent(() => {
        expect(liveExampleComponent).toBeTruthy('LiveExampleComponent');
      });
    }));

    it('should have expected plunker & download hrefs', async(() => {
      testPath = '/tutorial/toh-pt1';
      testComponent(() => {
        const hrefs = getHrefs();
        expect(hrefs[0]).toContain('/toh-pt1/eplnkr.html');
        expect(hrefs[1]).toContain('/toh-pt1/toh-pt1.zip');
      });
    }));

    it('should have expected plunker & download hrefs even when path has # frag', async(() => {
      testPath = '/tutorial/toh-pt1#somewhere';
      testComponent(() => {
        const hrefs = getHrefs();
        expect(hrefs[0]).toContain('/toh-pt1/eplnkr.html');
        expect(hrefs[1]).toContain('/toh-pt1/toh-pt1.zip');
      });
    }));

    it('should have expected plunker & download hrefs even when path has ? params', async(() => {
      testPath = '/tutorial/toh-pt1?foo=1&bar="bar"';
      testComponent(() => {
        const hrefs = getHrefs();
        expect(hrefs[0]).toContain('/toh-pt1/eplnkr.html');
        expect(hrefs[1]).toContain('/toh-pt1/toh-pt1.zip');
      });
    }));

    it('should have expected flat-style plunker when has `flat-style`', async(() => {
      testPath = '/tutorial/toh-pt1';
      setHostTemplate('<live-example flat-style></live-example>');
      testComponent(() => {
        // The file should be "plnkr.html", not "eplnkr.html"
        expect(getLiveExampleAnchor().href).toContain('/plnkr.html');
      });
    }));

    it('should have expected plunker & download hrefs when has example directory (name)', async(() => {
      testPath = '/guide/somewhere';
      setHostTemplate('<live-example name="toh-1"></live-example>');
      testComponent(() => {
        const hrefs = getHrefs();
        expect(hrefs[0]).toContain('/toh-1/eplnkr.html');
        expect(hrefs[1]).toContain('/toh-1/toh-1.zip');
      });
    }));

    it('should have expected plunker & download hrefs when has `plnkr`', async(() => {
      testPath = '/testing';
      setHostTemplate('<live-example plnkr="app-specs"></live-example>');
      testComponent(() => {
        const hrefs = getHrefs();
        expect(hrefs[0]).toContain('/testing/app-specs.eplnkr.html');
        expect(hrefs[1]).toContain('/testing/app-specs.testing.zip');
      });
    }));

    it('should have expected plunker & download hrefs when has `name` & `plnkr`', async(() => {
      testPath = '/guide/somewhere';
      setHostTemplate('<live-example name="testing" plnkr="app-specs"></live-example>');
      testComponent(() => {
        const hrefs = getHrefs();
        expect(hrefs[0]).toContain('/testing/app-specs.eplnkr.html');
        expect(hrefs[1]).toContain('/testing/app-specs.testing.zip');
      });
    }));

    it('should not have a download link when `noDownload` atty present', async(() => {
      setHostTemplate('<live-example noDownload></live-example>');
      testComponent(() => {
        expect(getAnchors().length).toBe(1, 'only the live-example anchor');
      });
    }));

    it('should have default title when no title attribute or content', async(() => {
      setHostTemplate('<live-example></live-example>');
      testComponent(() => {
        const expectedTitle = 'live example';
        const anchor = getLiveExampleAnchor();
        expect(anchor.innerText).toBe(expectedTitle, 'anchor content');
        expect(anchor.getAttribute('title')).toBe(expectedTitle, 'title');
      });
    }));

    it('should add title when set `title` attribute', async(() => {
      const expectedTitle = 'Great Example';
      setHostTemplate(`<live-example title="${expectedTitle}"></live-example>`);
      testComponent(() => {
        const anchor = getLiveExampleAnchor();
        expect(anchor.innerText).toBe(expectedTitle, 'anchor content');
        expect(anchor.getAttribute('title')).toBe(expectedTitle, 'title');
      });
    }));

    it('should add title from <live-example> body', async(() => {
      liveExampleContent = 'The Greatest Example';
      setHostTemplate('<live-example title="ignore this title"></live-example>');
      testComponent(() => {
        const anchor = getLiveExampleAnchor();
        expect(anchor.innerText).toBe(liveExampleContent, 'anchor content');
        expect(anchor.getAttribute('title')).toBe(liveExampleContent, 'title');
      });
    }));
  });

  describe('when embedded', () => {

    function getDownloadAnchor() {
      const anchor = liveExampleDe.query(By.css('p > a'));
      return anchor && anchor.nativeElement as HTMLAnchorElement;
    }

    function getEmbeddedPlunkerComponent() {
      const compDe = liveExampleDe.query(By.directive(EmbeddedPlunkerComponent));
      return compDe && compDe.componentInstance as EmbeddedPlunkerComponent;
    }

    function getImg() {
      const img = liveExampleDe.query(By.css('img'));
      return img && img.nativeElement as HTMLImageElement;
    }

    describe('before click', () => {

      it('should have hidden, embedded plunker', async(() => {
        setHostTemplate('<live-example embedded></live-example>');
        testComponent(() => {
          expect(liveExampleComponent.isEmbedded).toBe(true, 'component.isEmbedded');
          expect(liveExampleComponent.showEmbedded).toBe(false, 'component.showEmbedded');
          expect(getEmbeddedPlunkerComponent()).toBeNull('no EmbeddedPlunkerComponent');
        });
      }));

      it('should have default plunker placeholder image', async(() => {
        setHostTemplate('<live-example embedded></live-example>');
        testComponent(() => {
          expect(getImg().src).toContain('plunker/placeholder.png');
        });
      }));

      it('should have specified plunker placeholder image', async(() => {
        const expectedSrc = 'example/demo.png';
        setHostTemplate(`<live-example embedded img="${expectedSrc}"></live-example>`);
        testComponent(() => {
          expect(getImg().src).toContain(expectedSrc);
        });
      }));

      it('should have download paragraph with expected anchor href', async(() => {
        testPath = '/tutorial/toh-pt1';
        setHostTemplate('<live-example embedded></live-example>');
        testComponent(() => {
          expect(getDownloadAnchor().href).toContain('/toh-pt1/toh-pt1.zip');
        });
      }));

      it('should not have download paragraph when has `nodownload`', async(() => {
        testPath = '/tutorial/toh-pt1';
        setHostTemplate('<live-example embedded nodownload></live-example>');
        testComponent(() => {
          expect(getDownloadAnchor()).toBeNull();
        });
      }));

    });

    describe('after click', () => {

      function clickImg() {
        getImg().click();
        fixture.detectChanges();
      }

      it('should show plunker in the page', async(() => {
        setHostTemplate('<live-example embedded></live-example>');
        testComponent(() => {
          clickImg();
          expect(liveExampleComponent.isEmbedded).toBe(true, 'component.isEmbedded');
          expect(liveExampleComponent.showEmbedded).toBe(true, 'component.showEmbedded');
          expect(getEmbeddedPlunkerComponent()).toBeDefined('has EmbeddedPlunkerComponent');
        });
      }));

    });
  });
});
