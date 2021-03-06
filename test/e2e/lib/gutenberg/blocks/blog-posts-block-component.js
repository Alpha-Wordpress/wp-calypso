import { By } from 'selenium-webdriver';
import GutenbergBlockComponent from './gutenberg-block-component';

class BlogPostsBlockComponent extends GutenbergBlockComponent {
	static blockTitle = 'Blog Posts';
	static blockName = 'a8c/blog-posts';
	static blockFrontendLocator = By.css(
		'.entry-content .wp-block-newspack-blocks-homepage-articles'
	);
}

export { BlogPostsBlockComponent };
