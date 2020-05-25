import { Component, OnInit, Injectable } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, UrlSegmentGroup, ParamMap } from '@angular/router';
import { filter, first, take } from 'rxjs/operators';
import { LocalStorage } from './core/repository/local-storage';
import { AppConfig } from './app.config';

declare var $: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
@Injectable()
export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private localStorage: LocalStorage,
    ) { }

  ngOnInit(): void {

    this.jqueryInicialization();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd) 
    ).pipe(take(1)).subscribe(() => {
      let root: UrlSegmentGroup = this.router.parseUrl(this.router.url).root;
      let paramMap: ParamMap = this.activatedRoute.snapshot.queryParamMap;
      if ((root.hasChildren() || paramMap.keys.length == 0 || !this.guardarTokens(paramMap)) && !this.localStorage.isTokensSaved()) {
        window.location.href = AppConfig.LOGIN_URL;
      }
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd) 
    ).subscribe(() => {
      let primary = this.activatedRoute.snapshot.routeConfig.component.name;
      if(primary) {
        console.log(primary);
      }      
    });
  }

  guardarTokens(paramMap: ParamMap): boolean {
    let token = paramMap.get('token');
    let refreshToken = paramMap.get('refresh_token');
    if (token || refreshToken) {
      this.localStorage.saveTokens(paramMap.get('token'), paramMap.get('refresh_token'));
      return true;
    }
    return false;
  }



  jqueryInicialization(): void {
    // Toggle the side navigation
    $("#sidebarToggle, #sidebarToggleTop").on('click', function(e) {
      $("body").toggleClass("sidebar-toggled");
      $(".sidebar").toggleClass("toggled");
      if ($(".sidebar").hasClass("toggled")) {
        $('.sidebar .collapse').collapse('hide');
      };
    });
  
    // Close any open menu accordions when window is resized below 768px
    $(window).resize(function() {
      if ($(window).width() < 768) {
        $('.sidebar .collapse').collapse('hide');
      };
    });
  
    // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
    $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function(e) {
      if ($(window).width() > 768) {
        var e0 = e.originalEvent,
          delta = e0.wheelDelta || -e0.detail;
        this.scrollTop += (delta < 0 ? 1 : -1) * 30;
        e.preventDefault();
      }
    });
  
    // Scroll to top button appear
    $(document).on('scroll', function() {
      var scrollDistance = $(this).scrollTop();
      if (scrollDistance > 100) {
        $('.scroll-to-top').fadeIn();
      } else {
        $('.scroll-to-top').fadeOut();
      }
    });
  
    // Smooth scrolling using jQuery easing
    $(document).on('click', 'a.scroll-to-top', function(e) {
      var $anchor = $(this);
      $('html, body').stop().animate({
        scrollTop: ($($anchor.attr('href')).offset().top)
      }, 1000, 'easeInOutExpo');
      e.preventDefault();
    });
  }



}
