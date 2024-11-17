import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover";
import { Facebook, Twitter, Instagram, Share2, Link } from "lucide-react";

const SharePopover = () => {
    const shareUrl = window.location.href;
    
    const shareLinks = [
      {
        name: 'Facebook',
        icon: Facebook,
        url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
      },
      {
        name: 'Twitter',
        icon: Twitter,
        url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`
      },
      {
        name: 'Instagram',
        icon: Instagram,
        url: `https://www.instagram.com/share?url=${encodeURIComponent(shareUrl)}`
      }
    ];
  
    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(shareUrl);
        // You might want to add a toast notification here
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    };
  
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56">
          <div className="space-y-2">
            {shareLinks.map((link) => (
              <Button
                key={link.name}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => window.open(link.url, '_blank')}
              >
                <link.icon className="w-4 h-4 mr-2" />
                {link.name}
              </Button>
            ))}
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={copyToClipboard}
            >
              <Link className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  export default SharePopover