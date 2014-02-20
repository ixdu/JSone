function capsulated(capsule){
    capsule.dsa.send('sphere_ui', 'show');
    capsule.modules.sys.signal('TERM', function(){
				   capsule.dsa.send('sphere_core', 'release');
				   capsule.dsa.send('sphere_ui', 'release');
			       })    
}
